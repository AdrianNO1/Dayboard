import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
	CreateEventData,
	DashboardData,
	Email,
	EventData,
	ManualEventData,
	RawDashboardData,
	UpdateEventData,
} from "./types";
import { firstValueFrom, forkJoin } from "rxjs";
import { addDays, dateToString } from "./utils";
import { removePendingRequest, getPendingRequests } from "./indexedDB";
import { RETRY_REQUEST_HEADER } from "./constants";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	readonly BASE_URL = "http://localhost:8080/api";
	readonly EVENTS_ENDPOINT = this.BASE_URL + "/events";
	readonly DASHBOARD_ENDPOINT = this.BASE_URL + "/dashboard";

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
		forkJoin(pendingHttpPostRequests).subscribe(
			results => {
				console.log('All observables completed. Last values:', results); // Expected: [3, 0, 'c']
			},
			error => {
				console.error('An observable errored:', error);
			},
			() => {
				console.log('forkJoin completed.');
			}
		)
	}

	createNewEvent(event: CreateEventData) {
		return firstValueFrom(this.http.post(this.EVENTS_ENDPOINT, event));
	}

	updateEvent(event: UpdateEventData) {
		console.log("updating", event)
		return firstValueFrom(this.http.put(this.EVENTS_ENDPOINT, event));
	}

	deleteEvent(eventId: number) {
		return firstValueFrom(this.http.delete(this.EVENTS_ENDPOINT + "/" + eventId))
	}

	getDashboardData(date: Date): Promise<DashboardData> {
		return firstValueFrom(
			this.http.get<RawDashboardData>(this.DASHBOARD_ENDPOINT, {
				params: { date: dateToString(date) },
			}),
		)
	}

	getAllEventsData(): Promise<ManualEventData[]> {
		return firstValueFrom(this.http.get<ManualEventData[]>(this.EVENTS_ENDPOINT));
	}
}
