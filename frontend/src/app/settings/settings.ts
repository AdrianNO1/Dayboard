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
	// Modal state
	isEventFormModalOpen: boolean = false;
	eventFormModalIsEdit: boolean = false;
	eventFormModalInitialData?: ManualEventData;

	// View state
	showAllEvents: boolean = false;

	// Data query
	allEventsDataQuery = injectQuery(() => ({
		queryKey: ["allEventsData"],
		queryFn: () => this.httpService.getAllEventsData(),
		staleTime: 5 * 60 * 60 * 1000
	}));

	constructor(private httpService: HttpService) {}

	get allEventsData() {
		return this.allEventsDataQuery.data;
	}

	get toggleEventsButtonText(): string {
		return this.showAllEvents ? "Hide all events" : "Show all events";
	}

	openNewEventModal(): void {
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = false;
		this.eventFormModalInitialData = undefined;
	}

	closeNewEventModal(): void {
		this.isEventFormModalOpen = false;
	}

	toggleShowEvents(): void {
		this.showAllEvents = !this.showAllEvents;
	}

	openEventEditModal(clickedEvent: ManualEventData): void {
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = true;

		const allEventsData = this.allEventsData();
		const event = allEventsData?.find((e) => e.id === clickedEvent.id);
		if (!event) {
			throw new Error(`Event with id ${clickedEvent.id} not found`);
		}
		this.eventFormModalInitialData = event;
	}
}
