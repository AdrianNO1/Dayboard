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
	showAllEvents: boolean = false;
	eventFormModalIsEdit: boolean = false;
	eventFormModalInitialData?: ManualEventData;

	allEventsDataQuery = injectQuery(() => ({
		queryKey: ["allEventsData"],
		queryFn: () => this.httpService.getAllEventsData(),
		refetchOnWindowFocus: false,
	}));

	constructor(private httpService: HttpService) {}

	get allEventsData() {
		return this.allEventsDataQuery.data;
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

	getToggleEventsButtonText(): string {
		return this.showAllEvents ? "Hide all events" : "Show all events";
	}

	openEventEditModal(clickedEvent: ManualEventData): void {
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = true;

		const allEventsData = this.allEventsData();
		const event = allEventsData?.find((e) => e.id === clickedEvent.id);
		if (!event) {
			throw new Error(`Event with id ${clickedEvent.id} not found in ${allEventsData}`);
		}
		this.eventFormModalInitialData = event;
	}
}
