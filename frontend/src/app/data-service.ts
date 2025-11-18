import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

const cardData = [
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
	{ date: new Date(), text: "hello" },
	{ date: new Date(), text: "hello" },
	{ date: new Date(), text: "helloooooooooo" },
	{
		date: new Date(),
		text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u",
	},
];

const dashboardData = {
	cardData,
};

@Injectable({
	providedIn: "root",
})
export class DataService {
	getDashboardData(day: Date): Observable<DashboardData> {
		return of(dashboardData);
	}
}
