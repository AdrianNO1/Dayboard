import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateEventData, DashboardData, EventData } from "./types";
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

	getDashboardData(date: Date): Promise<DashboardData> {
		const stuff = firstValueFrom(
			this.http.get<DashboardData>(this.DASHBOARD_ENDPOINT, {
				params: { date: dateToString(date) },
			}),
		);
		return stuff;
	}
}
