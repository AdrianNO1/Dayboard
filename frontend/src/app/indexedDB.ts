import { IDBPDatabase, openDB } from "idb";
import { generateRandomKey } from "./utils";

const PENDING_REQUESTS_STORE = "pending_requests";
const RESPONSE_CACHE_STORE = "response_cache";

export interface PendingRequest {
	method: string;
	url: string;
	body: string;
}

export interface CachedResponse {
	url: string;
	response: string;
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

export async function deletePendingRequest(key: string) {
	const db = await getDB();
	await db.delete(PENDING_REQUESTS_STORE, key);
}

export async function addPendingRequest(pendingRequest: PendingRequest, key?: string) {
	const db = await getDB();
	if (!key) {
		key = generateRandomKey();
	}
	await db.put(PENDING_REQUESTS_STORE, pendingRequest, key);
	return key;
}

export async function getPendingRequests() {
	const db = await getDB();
	return await db.getAll(PENDING_REQUESTS_STORE);
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