import { Component } from "@angular/core";
import { NewEvent } from "../new-event/new-event";
import { Modal } from "../modal/modal";
import { AllEventsView } from "../all-events-view/all-events-view";

@Component({
	selector: "app-settings",
	imports: [NewEvent, Modal, AllEventsView],
	templateUrl: "./settings.html",
	styleUrl: "./settings.scss",
})
export class Settings {
	isNewEventModalOpen = false;
	showAllEvents: boolean = true;

	openNewEventModal() {
		this.isNewEventModalOpen = true;
	}

	closeNewEventModal() {
		this.isNewEventModalOpen = false;
	}

	getToggleEventsButtonText() {
		if (this.showAllEvents) {
			return "Hide all events";
		}
		return "Show all events";
	}

	toggleShowEvents() {
		this.showAllEvents = !this.showAllEvents;
	}
}
