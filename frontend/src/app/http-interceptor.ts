import {
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpInterceptorFn,
	HttpResponse,
} from "@angular/common/http";
import { IDBPDatabase, openDB } from "idb";
import { catchError, from, mergeMap, of, tap, throwError } from "rxjs";

const PENDING_REQUESTS_STORE = "pending_requests";
const RESPONSE_CACHE_STORE = "response_cache";

interface PendingRequest {
	method: string;
	url: string;
	body: string;
}

interface CachedResponse {
	url: string;
	response: string;
}

let dbPromise: Promise<IDBPDatabase>;

async function getDB() {
	if (!dbPromise) {
		dbPromise = openDB("dayboardData", 2, {
			upgrade(db, oldVersion) {
				if (oldVersion < 1) {
					db.createObjectStore(PENDING_REQUESTS_STORE);
				}
				if (oldVersion < 2) {
					db.createObjectStore(RESPONSE_CACHE_STORE);
				}
			},
		});
	}
	return dbPromise;
}

async function deletePendingRequest(key: string) {
	const db = await getDB();
	await db.delete(PENDING_REQUESTS_STORE, key);
}

async function addPendingRequest(pendingRequest: PendingRequest) {
	const db = await getDB();
	const key = new Date().toISOString() + "__" + Math.floor(Math.random() * 10 ** 8);
	await db.put(PENDING_REQUESTS_STORE, pendingRequest, key);
	return key;
}

async function getPendingRequests() {
	const db = await getDB();
	return await db.getAll(PENDING_REQUESTS_STORE);
}

getPendingRequests().then(console.log)

async function cacheResponse(data: CachedResponse) {
	const db = await getDB();
	const key = data.url
	await db.put(RESPONSE_CACHE_STORE, data, key);
	return key;
}

async function getCachedResponse(key: string) {
	const db = await getDB();
	return await db.get(RESPONSE_CACHE_STORE, key)
}

getDB()

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	switch (req.method) {
		case "POST":
			const pendingRequest: PendingRequest = {
				method: req.method,
				url: req.urlWithParams,
				body: JSON.stringify(req.body),
			};

			const keyPromise = addPendingRequest(pendingRequest);

			const handleRequestEvent = async (event: HttpEvent<unknown> | null, err: unknown) => {
				if (event?.type === HttpEventType.Response) {
					deletePendingRequest(await keyPromise);
				} else if (err instanceof HttpErrorResponse) {
					if (err.status !== 0) {
						deletePendingRequest(await keyPromise);
					} else {
						console.log("could not connect to server. request queued.");
					}
				}
			};

			return next(req).pipe(
				tap({
					next: (data) => handleRequestEvent(data, null),
					error: (err) => handleRequestEvent(null, err),
				}),
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
									console.log("response", response)
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
