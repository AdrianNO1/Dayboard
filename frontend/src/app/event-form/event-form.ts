import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import {
	EventDateType,
	EventType,
	CreateEventData,
	ManualEventData,
	UpdateEventData,
} from "../types";
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
import { ActivatedRoute } from "@angular/router";
import { BIRTHDAY_SUFFIX } from "../config";
import { offlineMode } from "../http-interceptor";

type StatusMessageType = "error" | "success" | "pending" | null;

type MutationVars =
	| { isEdit: false; payload: CreateEventData }
	| { isEdit: true; payload: UpdateEventData };

@Component({
	selector: "app-event-form",
	imports: [FormsModule, EventTypeSelector, EventDateTypeSelector],
	templateUrl: "./event-form.html",
	styleUrl: "./event-form.scss",
})
export class EventForm {
	offlineMode = offlineMode;

	httpService = inject(HttpService);
	queryClient = inject(QueryClient);

	eventTypeOptions: EventType[] = ["Reminder", "Birthday", "World"];
	selectedEventType: EventType = this.eventTypeOptions[0];
	dateTypeOptions: EventDateType[] = ["Dateyear", "Date", "RRule", "Custom"];
	selectedDateType: EventDateType = this.dateTypeOptions[0];

	eventText: string = "";
	date: string = "";
	daysNotice?: number;
	statusMessage = signal<string>("");
	statusMessageType = signal<StatusMessageType>(null)

	@Input() initialData?: ManualEventData;
	@Input() isEdit: boolean = false;
	@Output() onClose = new EventEmitter();

	ngOnInit() {
		if (this.initialData) {
			this.eventText = this.initialData.eventText;
			this.date = this.initialData.date;
			this.daysNotice = this.initialData.daysNotice;
			this.selectedDateType = this.initialData.dateType;
			this.selectedEventType = this.initialData.eventType;
		}
	}

	private onMutationError = (error: Error) => {
		this.setError((error as any).error?.message || error.message);
		console.error(error);
	}

	private onMutationMutate = async () => {
		this.statusMessage.set("Pending...");
		this.statusMessageType.set("pending");
	}

	saveMutation = injectMutation(() => ({
		mutationFn: ({ payload, isEdit }: MutationVars) => {
			if (isEdit) {
				const a = this.httpService.updateEvent(payload);
				console.log(a);
				return a
			}
			return this.httpService.createNewEvent(payload);
		},
		onSuccess: (data) => {
			this.eventText = "";
			this.date = "";
			this.setSuccess(offlineMode() ? "Queued!" : "Success!");
			this.queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
			this.queryClient.invalidateQueries({ queryKey: ["allEventsData"] });
			this.onClose.emit();
		},
		onError: this.onMutationError,
		onMutate: this.onMutationMutate,
	}));

	deleteMutation = injectMutation(() => ({
		mutationFn: (eventId: number) => {
			return this.httpService.deleteEvent(eventId);
		},
		onSuccess: (data) => {
			this.setSuccess(offlineMode() ? "Queued!" : "Deleted!");
			this.queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
			this.queryClient.invalidateQueries({ queryKey: ["allEventsData"] });
		},
		onError: this.onMutationError,
		onMutate: this.onMutationMutate,
	}));

	setError(msg: string) {
		this.statusMessage.set(msg);
		this.statusMessageType.set("error");
	}

	setSuccess(msg: string) {
		this.statusMessage.set(msg);
		this.statusMessageType.set("success");
	}

	setSelectedEventType(type: EventType) {
		this.selectedEventType = type;
	}

	setSelectedDateType(type: EventDateType) {
		this.selectedDateType = type;
	}

	getTitleText() {
		return this.isEdit ? "Edit Event" : "New Event";
	}

	getSubmitButtonText() {
		return this.isEdit ? "Update" : "Create";
	}

	onSubmit() {
		let date = this.date;
		if (!date) {
			this.setError("missing date");
			return;
		}

		if (!this.eventText) {
			this.setError("missing event text");
			return;
		}
		let dateType = this.selectedDateType;
		switch (this.selectedDateType) {
			case "Dateyear":
				if (!stringToDate(date)) {
					this.setError("Invalid date year format");
					return;
				}
				if (this.selectedEventType === "Birthday") {
					date = date.split("-").reverse().slice(0, 2).join("-");
					dateType = "Date";
				} else {
					break;
				}
			case "Date":
				const DD_MM_re = /^(?:[1-9]|0[1-9]|[12]\d|3[01])[-.](?:[1-9]|0[1-9]|1[0-2])$/;
				if (!DD_MM_re.test(date)) {
					this.setError("Invalid DD-MM date: " + date);
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

		const createEventData: CreateEventData = {
			eventType: this.selectedEventType,
			eventText: this.eventText,
			date: date,
			dateType,
			daysNotice: this.daysNotice,
		};

		if (this.isEdit) {
			if (!this.initialData) {
				this.setError("Missing initial data for id");
				return;
			}
			const updateEventData: UpdateEventData = {
				id: this.initialData.id,
				...createEventData,
			};
			console.log(this.saveMutation.mutate({ payload: updateEventData, isEdit: true }));
		} else {
			if (createEventData.eventType === "Birthday" && BIRTHDAY_SUFFIX) {
				createEventData.eventText += BIRTHDAY_SUFFIX;
			}
			this.saveMutation.mutate({ payload: createEventData, isEdit: false });
		}
	}

	onDelete() {
		if (this.initialData) {
			if (confirm("Are you sure you want to delete this event?\n" + this.initialData.eventText)) {
				this.deleteMutation.mutate(this.initialData.id)
			}
		} else {
			alert("InitialData not set")
		}
	}
}
