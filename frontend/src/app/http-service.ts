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
import { firstValueFrom, forkJoin } from "rxjs";
import { addDays, dateToString } from "./utils";
import { removePendingRequest, getPendingRequests } from "./indexedDB";
import { DASHBOARD_ENDPOINT, EVENTS_ENDPOINT, RETRY_REQUEST_HEADER } from "./constants";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	constructor(private http: HttpClient) {
		this.processPendingRequests()
	}

	async processPendingRequests() {
		const pendingRequests = await getPendingRequests()
		if (pendingRequests.length === 0) {
			return
		}
		console.log("Doing ", pendingRequests.length, "pending requests")
		const pendingHttpPostRequests = []
		for (const pendingReq of pendingRequests) {
			const postReq$ = this.http.post(pendingReq.url, pendingReq.body, {
				headers: {
					[RETRY_REQUEST_HEADER]: "true"
				}
			})
			pendingHttpPostRequests.push(postReq$)
		}
		forkJoin(pendingHttpPostRequests).subscribe({
			next: results => {
				console.log('All observables completed. Last values:', results);
			},
			error: error => {
				console.error('An observable errored:', error);
			},
			complete: () => {
				console.log('forkJoin completed.');
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

	getDashboardData(date: Date): Promise<DashboardData> {
		const a = firstValueFrom(
			this.http.get<DashboardData>(DASHBOARD_ENDPOINT, {
				params: { date: dateToString(date) },
			})
		)
		a.then(console.log)
		return a
	}

	getAllEventsData(): Promise<ManualEventData[]> {
		return firstValueFrom(this.http.get<ManualEventData[]>(EVENTS_ENDPOINT));
	}
}
