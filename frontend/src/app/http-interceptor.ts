import {
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpInterceptorFn,
	HttpResponse,
} from "@angular/common/http";
import { signal } from "@angular/core";
import { catchError, from, mergeMap, of, tap, throwError } from "rxjs";
import { addPendingRequest, CachedResponse, cacheResponse, deletePendingRequest, getCachedResponse, PendingRequest } from "./indexedDB";
import { generateRandomKey } from "./utils";

export const offlineMode = signal<boolean>(false)

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	switch (req.method) {
		case "POST":
			const pendingRequest: PendingRequest = {
				method: req.method,
				url: req.urlWithParams,
				body: JSON.stringify(req.body),
			};

			const key = generateRandomKey()
			addPendingRequest(pendingRequest, key);

			const handleRequestEvent = async (event: HttpEvent<unknown> | null, err: unknown) => {
				if (event?.type === HttpEventType.Response) {
					deletePendingRequest(key);
				} else if (err instanceof HttpErrorResponse) {
					if (err.status !== 0) {
						deletePendingRequest(key);
					}
				}
			};

			return next(req).pipe(
				tap({
					next: (data) => handleRequestEvent(data, null),
				}),
				catchError((error) => {
					if (error.status !== 0) {
						deletePendingRequest(key);
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
			const isDashboardReq = req.url.endsWith("/api/dashboard")
			if (isDashboardReq || req.url.endsWith("/api/events")) {
				const cacheRequestData = async (data: any) => {
					const cacheData: CachedResponse = {
						url: req.url,
						response: JSON.stringify(data?.body)
					}
					cacheResponse(cacheData)
					offlineMode.set(false)
				}

				return next(req).pipe(
					tap({
						next: (data) => data?.type === HttpEventType.Response && cacheRequestData(data)
					}),
					catchError((error) => {
						if (error.status !== 0) {
							return throwError(() => error);
						}
						return from(getCachedResponse(req.url)).pipe(
							mergeMap(cached => {
								if (cached) {
									const response = new HttpResponse({
										body: JSON.parse(cached.response),
										status: 200,
										statusText: "OK",
										url: req.urlWithParams
									})
									offlineMode.set(true)
									return of(response)
								}
								return throwError(() => error)
							})
						)
					})
				)
			}
		default:
			return next(req);
	}
};
