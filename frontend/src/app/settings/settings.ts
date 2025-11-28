import { Component } from "@angular/core";
import { Modal } from "../modal/modal";
import { AllEventsView } from "../all-events-view/all-events-view";
import { EventForm } from "../event-form/event-form";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";
import { ManualEventData } from "../types";

@Component({
	selector: "app-settings",
	imports: [EventForm, Modal, AllEventsView],
	templateUrl: "./settings.html",
	styleUrl: "./settings.scss",
})
export class Settings {
	isEventFormModalOpen = false;
	showAllEvents: boolean = true;
	eventFormModalIsEdit: boolean = false;
	eventFormModalInitialData?: ManualEventData

	allEventsDataQuery = injectQuery(() => ({
		queryKey: ["allEventsData"],
		queryFn: () => this.httpService.getAllEventsData(),
	}));

	constructor(private httpService: HttpService) {}

	get allEventsData() {
		return this.allEventsDataQuery.data
	}

	openNewEventModal() {
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = false;
		this.eventFormModalInitialData = undefined;
	}

	closeNewEventModal() {
		this.isEventFormModalOpen = false;
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

	openEventEditModal(clickedEvent: ManualEventData) {
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = true;
		
		const allEventsData = this.allEventsData();
		const event = allEventsData?.find((e) => e.id === clickedEvent.id)
		if (!event) {
			throw new Error(`Event with id ${clickedEvent.id} not found in ${allEventsData}`)
		}
		this.eventFormModalInitialData = event
	}
}
