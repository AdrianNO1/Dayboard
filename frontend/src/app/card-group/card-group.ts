import { Component, Input } from "@angular/core";
import { Card } from "../card/card";

@Component({
	selector: "app-card-group",
	imports: [Card],
	templateUrl: "./card-group.html",
	styleUrl: "./card-group.scss",
})
export class CardGroup {
	@Input() title: string = "Today";
	@Input() cards: CardData[] = [
		{ date: new Date(), text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u" },
		{ date: new Date(), text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u" },
		{ date: new Date(), text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u" },
		{ date: new Date(), text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u" },
		{ date: new Date(), text: "hello" },
		{ date: new Date(), text: "hello" },
		{ date: new Date(), text: "helloooooooooo" },
		{ date: new Date(), text: "hello lorem iåsum something ioa jasdj oaij dija ji jsaid jaisojad jiasdj ihrugh ruigh rui ghuihurhg u" },
	];
}
