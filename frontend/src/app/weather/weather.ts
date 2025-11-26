import { Component } from "@angular/core";
import { WEATHER_EMBED_URL } from "../config";
import { Modal } from "../modal/modal";

@Component({
	selector: "app-weather",
	imports: [Modal],
	templateUrl: "./weather.html",
	styleUrl: "./weather.scss",
})
export class Weather {
	embedUrl: string = WEATHER_EMBED_URL;
	bigModalOpen: boolean = false;

	openBig() {
		this.bigModalOpen = true;
	}

	closeBig() {
		this.bigModalOpen = false;
	}
}
