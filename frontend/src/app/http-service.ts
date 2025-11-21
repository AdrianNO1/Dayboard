import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateEventApiBody, DashboardData } from "./types";
import { firstValueFrom } from "rxjs";
import { addDays } from "./utils";

const cardData = [
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
	{ date: new Date(), text: "hello" },
	{ date: new Date(), text: "helloooooooooo" },
	{
		date: addDays(new Date(), 1),
		text: "tomorrow",
	},
	{
		date: addDays(new Date(), 7),
		text: "next week",
	},
];

const dashboardData: DashboardData = {
	eventData: cardData,
};

@Injectable({
	providedIn: "root",
})
export class HttpService {
	readonly BASE_URL = "http://localhost:8080";
	readonly CREATE_EVENT_ENDPOINT = "/create-event";

	constructor(private http: HttpClient) {}

	createNewEvent(event: CreateEventApiBody) {
		return Promise.resolve(200);
		return firstValueFrom(this.http.post(this.BASE_URL + this.CREATE_EVENT_ENDPOINT, event));
	}

	getDashboardData(date: Date): Promise<DashboardData> {
		console.log("getting dashboard data", date);
		return Promise.resolve(dashboardData);
	}
}
