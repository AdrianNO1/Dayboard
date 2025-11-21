import { Component, inject } from "@angular/core";
import { EventDateType, EventType, CreateEventApiBody } from "../types";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { RRule } from "RRule";
import { dateToString, toDate } from "../utils";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";

@Component({
	selector: "app-new-event",
	imports: [ReactiveFormsModule],
	templateUrl: "./new-event.html",
	styleUrl: "./new-event.scss",
})
export class NewEvent {
	httpService = inject(HttpService);
	queryClient = inject(QueryClient);
	selectedEventType: EventType = "Birthday";
	eventTypeButtons: EventType[] = ["Reminder", "Birthday", "World"];

	eventText = new FormControl("", Validators.required);
	date = new FormControl("", Validators.required);
	errorMessage: string = "";
	successMessage: string = "";

	mutation = injectMutation(() => ({
		mutationFn: (payload: CreateEventApiBody) => this.httpService.createNewEvent(payload),
		onSuccess: (data, variables, context) => {
			this.eventText.reset();
			this.date.reset();
			this.setSuccess("Success!");
			this.queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
		},
		onError: (error, variables, context) => {
			this.setError(error.message);
			console.error(error);
		},
		onMutate: async (variables) => {
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

	setSelectedEventType(type: EventType) {
		this.selectedEventType = type;
	}

	onCreate() {
		let dateType: EventDateType;
		if (this.eventText.invalid || this.date.invalid) {
			this.setError("invalid fields");
			return;
		}
		let value = this.date.value;
		if (value === null) {
			this.setError("missing date");
			return;
		}
		const DD_MM_re = /^(?:[1-9]|0[1-9]|[12]\d|3[01])[-.](?:[1-9]|0[1-9]|1[0-2])$/;
		if (DD_MM_re.test(value)) {
			dateType = "Date";
		} else if (toDate(value)) {
			value = dateToString(toDate(value)!);
			dateType = "Dateyear";
		} else {
			try {
				RRule.fromString(value);
				dateType = "RRule";
			} catch {
				this.setError("invalid rrule");
				return;
			}
		}

		const eventText = this.eventText.value;
		if (!eventText) {
			this.setError("missing event text");
			return;
		}

		const body: CreateEventApiBody = {
			eventType: this.selectedEventType,
			eventText,
			date: value,
			dateType,
		};

		this.mutation.mutate(body);
	}
}
