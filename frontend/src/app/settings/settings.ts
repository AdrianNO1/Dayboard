import { Component } from "@angular/core";
import { NewEvent } from "../new-event/new-event";
import { Modal } from "../modal/modal";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-settings",
	imports: [NewEvent, Modal],
	templateUrl: "./settings.html",
	styleUrl: "./settings.scss",
})
export class Settings {
	isNewEventModalOpen = true;
	router: Router;
	route: ActivatedRoute;

	constructor(router: Router, route: ActivatedRoute) {
		this.router = router;
		this.route = route;
	}

	openNewEventModal() {
		this.isNewEventModalOpen = true;
	}

	closeNewEventModal() {
		this.isNewEventModalOpen = false;
	}
}
