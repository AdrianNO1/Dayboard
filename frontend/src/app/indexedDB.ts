import { IDBPDatabase, openDB } from "idb";
import { generateRandomKey } from "./utils";

const PENDING_REQUESTS_STORE = "pending_requests";
const RESPONSE_CACHE_STORE = "response_cache";

export interface PendingRequest {
	url: string;
	body: Object;
	method: string;
}

export interface PendingRequestWithKey extends PendingRequest {
	key: string;
}

export interface CachedResponse {
	url: string;
	response: Object;
}

let dbPromise: Promise<IDBPDatabase>;

export async function getDB() {
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

export async function removePendingRequest(key: string) {
	const db = await getDB();
	await db.delete(PENDING_REQUESTS_STORE, key);
}

export async function addPendingRequest(pendingRequest: PendingRequest, key?: string) {
	const db = await getDB();
	if (!key) {
		key = generateRandomKey();
	}
	await db.put(PENDING_REQUESTS_STORE, { ...pendingRequest, key }, key);
	return key;
}

export async function getPendingRequests() {
	const db = await getDB();
	return await db.getAll(PENDING_REQUESTS_STORE) as PendingRequestWithKey[];
}

export async function cacheResponse(data: CachedResponse) {
	const db = await getDB();
	const key = data.url
	await db.put(RESPONSE_CACHE_STORE, data, key);
	return key;
}

export async function getCachedResponse(key: string) {
	const db = await getDB();
	return await db.get(RESPONSE_CACHE_STORE, key)
}

getDB()