import {
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpInterceptorFn,
	HttpResponse,
} from "@angular/common/http";
import { signal } from "@angular/core";
import { catchError, from, mergeMap, of, tap, throwError } from "rxjs";
import { addPendingRequest, CachedResponse, cacheResponse, removePendingRequest, getCachedResponse, PendingRequest } from "./indexedDB";
import { dateToString, generateRandomKey } from "./utils";
import { DASHBOARD_ENDPOINT, EVENTS_ENDPOINT, RETRY_REQUEST_HEADER } from "./constants";

export const offlineMode = signal<boolean>(false)

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	switch (req.method) {
		case "POST":
			if (req.headers.get(RETRY_REQUEST_HEADER) === "true") {
				break;
			}
			const pendingRequest: PendingRequest = {
				url: req.urlWithParams,
				body: req.body as Object,
			};

			const key = generateRandomKey()
			addPendingRequest(pendingRequest, key);

			const handleRequestEvent = async (event: HttpEvent<unknown> | null, err: unknown) => {
				if (event?.type === HttpEventType.Response) {
					removePendingRequest(key);
				} else if (err instanceof HttpErrorResponse) {
					if (err.status !== 0) {
						removePendingRequest(key);
					}
				}
			};

			return next(req).pipe(
				tap({
					next: (data) => handleRequestEvent(data, null),
				}),
				catchError((error) => {
					if (error.status !== 0) {
						removePendingRequest(key);
						return throwError(() => error);
					}
					const response = new HttpResponse({
						status: 202,
						statusText: "Accepted",
						url: req.urlWithParams
					})
					return of(response)
				})
			);
		case "GET":
			const isDashboardReq = req.url.endsWith(DASHBOARD_ENDPOINT);
			if (isDashboardReq || req.url.endsWith(EVENTS_ENDPOINT)) {
				const cacheRequestData = async (data: any) => {
					const cacheData: CachedResponse = {
						url: req.url,
						response: data?.body
					}
					cacheResponse(cacheData)
					offlineMode.set(false)
				}

				return next(req).pipe(
					tap({
						next: (data) => data?.type === HttpEventType.Response && cacheRequestData(data)
					}),
					catchError((error) => {
						console.log(error)
						if (error.status !== 0) {
							return throwError(() => error);
						}
						return from(getCachedResponse(req.url)).pipe(
							mergeMap(cached => {
								if (req.url.endsWith(DASHBOARD_ENDPOINT) && req.params.get("date") !== dateToString(new Date())) {
									if (cached?.response?.emails) {
										cached.response.emails = [];
									}
								}
								if (cached) {
									const response = new HttpResponse({
										body: cached.response,
										status: 200,
										statusText: "OK",
										url: req.urlWithParams
									})
									console.log("Using offline mode")
									offlineMode.set(true)
									return of(response)
								}
								return throwError(() => error)
							})
						)
					})
				)
			}
		}
	return next(req);
};
