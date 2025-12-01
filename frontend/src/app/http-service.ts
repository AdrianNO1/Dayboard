import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
	CreateEventData,
	DashboardData,
	EventData,
	ManualEventData,
	UpdateEventData,
} from "./types";
import { firstValueFrom } from "rxjs";
import { addDays, dateToString } from "./utils";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	readonly BASE_URL = "http://localhost:8080/api";
	readonly EVENTS_ENDPOINT = this.BASE_URL + "/events";
	readonly DASHBOARD_ENDPOINT = this.BASE_URL + "/dashboard";

	constructor(private http: HttpClient) {}

	createNewEvent(event: CreateEventData) {
		return firstValueFrom(this.http.post(this.EVENTS_ENDPOINT, event));
	}

	updateEvent(event: UpdateEventData) {
		return firstValueFrom(this.http.put(this.EVENTS_ENDPOINT + "/" + event.id, event));
	}

	getDashboardData(date: Date): Promise<DashboardData> {
		return firstValueFrom(
			this.http.get<DashboardData>(this.DASHBOARD_ENDPOINT, {
				params: { date: dateToString(date) },
			}),
		);
	}

	getAllEventsData(): Promise<ManualEventData[]> {
		return firstValueFrom(this.http.get<ManualEventData[]>(this.EVENTS_ENDPOINT));
	}
}
