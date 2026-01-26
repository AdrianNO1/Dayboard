import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
	CreateEventData,
	DashboardData,
	Email,
	EventData,
	ManualEventData,
	UpdateEventData,
} from "./types";
import { firstValueFrom, forkJoin, Observable } from "rxjs";
import { addDays, dateToString } from "./utils";
import { removePendingRequest, getPendingRequests } from "./indexedDB";
import { DASHBOARD_ENDPOINT, EVENTS_ENDPOINT, RETRY_REQUEST_HEADER } from "./constants";
import { QueryClient } from "@tanstack/angular-query-experimental";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	constructor(private http: HttpClient, private queryClient: QueryClient) {
		this.processPendingRequests()
	}

	async processPendingRequests() {
		const pendingRequests = await getPendingRequests()
		if (pendingRequests.length === 0) {
			return
		}
		const requests: Observable<Object>[] = [];
		for (const pendingReq of pendingRequests) {
			const postReq$ = this.http.request(pendingReq.method || "POST", pendingReq.url, {
				body: pendingReq.body,
				headers: {
					[RETRY_REQUEST_HEADER]: "true"
				}
			})
			postReq$.subscribe({
				complete: () => removePendingRequest(pendingReq.key)
			})
		}
		forkJoin(requests).subscribe({
			complete: () => {
				setTimeout(() => {
					console.log("Invalidating cache")
					this.queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
					this.queryClient.invalidateQueries({ queryKey: ["allEventsData"] });
				}, 1000)
			}
		})
	}

	createNewEvent(event: CreateEventData) {
		return firstValueFrom(this.http.post(EVENTS_ENDPOINT, event));
	}

	updateEvent(event: UpdateEventData) {
		console.log("updating", event)
		return firstValueFrom(this.http.put(EVENTS_ENDPOINT, event));
	}

	deleteEvent(eventId: number) {
		return firstValueFrom(this.http.delete(EVENTS_ENDPOINT + "/" + eventId))
	}

	getDashboardData(date: Date, fetchEmails: boolean): Promise<DashboardData> {
		const a = firstValueFrom(
			this.http.get<DashboardData>(DASHBOARD_ENDPOINT, {
				params: { date: dateToString(date), fetchEmails },
			})
		)
		a.then(console.log)
		return a
	}

	getAllEventsData(): Promise<ManualEventData[]> {
		return firstValueFrom(this.http.get<ManualEventData[]>(EVENTS_ENDPOINT));
	}
}
