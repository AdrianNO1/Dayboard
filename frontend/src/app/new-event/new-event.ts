import { Component, inject } from "@angular/core";
import { EventDateType, EventType, EventData, CreateEventData, ManualEventType } from "../types";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RRule } from "RRule";
import { dateToString, stringToDate } from "../utils";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";
import {
	ButtonSelector,
	EventTypeSelector,
	EventDateTypeSelector,
} from "../button-selector/button-selector";

@Component({
	selector: "app-new-event",
	imports: [FormsModule, EventTypeSelector, EventDateTypeSelector],
	templateUrl: "./new-event.html",
	styleUrl: "./new-event.scss",
})
export class NewEvent {
	httpService = inject(HttpService);
	queryClient = inject(QueryClient);

	eventTypeOptions: ManualEventType[] = ["Reminder", "Birthday", "World"];
	selectedEventType: ManualEventType = this.eventTypeOptions[0];
	dateTypeOptions: EventDateType[] = ["Dateyear", "Date", "RRule", "Custom"];
	selectedDateType: EventDateType = this.dateTypeOptions[0];

	eventText: string = "";
	date: string = "";
	daysNotice: string = "";
	errorMessage: string = "";
	successMessage: string = "";

	mutation = injectMutation(() => ({
		mutationFn: (payload: CreateEventData) => this.httpService.createNewEvent(payload),
		onSuccess: () => {
			this.eventText = "";
			this.date = "";
			this.setSuccess("Success!");
			this.queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
		},
		onError: (error) => {
			this.setError((error as any).error?.message || error.message);
			console.error(error);
		},
		onMutate: async () => {
			this.setError("");
		},
	}));

	setError(msg: string) {
		this.errorMessage = msg;
		this.successMessage = "";
	}

	setSuccess(msg: string) {
		this.successMessage = msg;
		this.errorMessage = "";
	}

	setSelectedEventType(type: ManualEventType) {
		this.selectedEventType = type;
	}

	setSelectedDateType(type: EventDateType) {
		this.selectedDateType = type;
	}

	onCreate() {
		let date = this.date;
		if (!date) {
			this.setError("missing date");
			return;
		}

		if (!this.eventText) {
			this.setError("missing event text");
			return;
		}

		switch (this.selectedDateType) {
			case "Date":
				const DD_MM_re = /^(?:[1-9]|0[1-9]|[12]\d|3[01])[-.](?:[1-9]|0[1-9]|1[0-2])$/;
				if (!DD_MM_re.test(date)) {
					this.setError("Invalid DD-MM date");
					return;
				}
				break;
			case "Dateyear":
				if (!stringToDate(date)) {
					this.setError("Invalid date year format");
					return;
				}
				break;
			case "RRule":
				try {
					if (date.startsWith("RRULE:")) {
						date = date.slice("RRULE:".length);
					}
					RRule.fromString(date);
				} catch {
					this.setError("invalid rrule");
					return;
				}
		}

		const body: CreateEventData = {
			eventType: this.selectedEventType,
			eventText: this.eventText,
			date: date,
			dateType: this.selectedDateType,
		};

		this.mutation.mutate(body);
	}
}
