import {
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpInterceptorFn,
	HttpRequest,
	HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, from, mergeMap, Observable, of, tap, throwError } from "rxjs";
import { addPendingRequest, CachedResponse, cacheResponse, removePendingRequest, getCachedResponse, PendingRequest } from "./indexedDB";
import { dateToString, generateRandomKey } from "./utils";
import { DASHBOARD_ENDPOINT, EVENTS_ENDPOINT, RETRY_REQUEST_HEADER } from "./constants";
import { HttpService } from "./http-service";

import { offlineMode } from "./offline-mode";

function isOfflineCacheableGet(req: HttpRequest<unknown>): boolean {
	return req.method === "GET" && (req.url.endsWith(DASHBOARD_ENDPOINT) || req.url.endsWith(EVENTS_ENDPOINT));
}

function serveFromCache(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
	return from(getCachedResponse(req.url)).pipe(
		mergeMap(cached => {
			if (req.url.endsWith(DASHBOARD_ENDPOINT) && req.params.get("date") !== dateToString(new Date())) {
				if (cached?.response?.emails) {
					cached.response.emails = [];
				}
			}
			if (cached) {
				return of(new HttpResponse({
					body: cached.response,
					status: 200,
					statusText: "OK",
					url: req.urlWithParams
				}));
			}
			return throwError(() => new HttpErrorResponse({
				status: 0,
				statusText: "Offline and no cached response",
				url: req.urlWithParams,
			}));
		})
	);
}

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	const httpService = inject(HttpService);

	switch (req.method) {
		case "POST":
		case "PUT":
		case "DELETE":
			if (req.headers.get(RETRY_REQUEST_HEADER) === "true") {
				break;
			}
			const pendingRequest: PendingRequest = {
				url: req.urlWithParams,
				body: req.body as Object,
				method: req.method,
			};

			const key = generateRandomKey()
			addPendingRequest(pendingRequest, key);

			if (offlineMode()) {
				return of(new HttpResponse({
					status: 202,
					statusText: "Accepted",
					url: req.urlWithParams
				}));
			}

			const handleRequestEvent = async (event: HttpEvent<unknown> | null, err: unknown) => {
				if (event?.type === HttpEventType.Response) {
					removePendingRequest(key);
				} else if (err instanceof HttpErrorResponse) {
					if (err.status !== 0 && err.status !== 504) {
						removePendingRequest(key);
					}
				}
			};

			return next(req).pipe(
				tap({
					next: (data) => handleRequestEvent(data, null),
				}),
				catchError((error) => {
					if (error.status != 0 && error.status != 504) {
						removePendingRequest(key);
						return throwError(() => error);
					}
					const response = new HttpResponse({
						status: 202,
						statusText: "Accepted",
						url: req.urlWithParams
					})
					offlineMode.set(true)
					return of(response)
				})
			);
		case "GET":
			if (isOfflineCacheableGet(req)) {
				if (offlineMode()) {
					return serveFromCache(req);
				}

				const cacheRequestData = async (data: any) => {
					const cacheData: CachedResponse = {
						url: req.url,
						response: data?.body
					}
					cacheResponse(cacheData)
					offlineMode.set(false)
					httpService.processPendingRequests()
				}

				return next(req).pipe(
					tap({
						next: (data) => data?.type === HttpEventType.Response && cacheRequestData(data)
					}),
					catchError((error) => {
						if (error.status != 0 && error.status != 504) {
							return throwError(() => error);
						}
						offlineMode.set(true)
						return serveFromCache(req);
					})
				)
			}
	}
	return next(req);
};
