export type EventType = "Birthday" | "Reminder" | "Email" | "World";
export type ManualEventType = Exclude<EventType, "Email">;

export type EventDateType = "Date" | "Dateyear" | "RRule" | "Custom";

export interface ManualEventData {
	id: number;
	eventText: string;
	eventType: ManualEventType;
	date: string;
	dateType: EventDateType;
	daysNotice: number;
	createdAt: string;
	updatedAt: string;
}

export interface Email {
	eventText: string;
	eventTitle?: string;
	eventType: "Email";
	sender: string;
}

export type EventData = ManualEventData | Email;

export interface CreateEventData {
	eventText: string;
	eventType: EventType;
	date: string;
	dateType: EventDateType;
	daysNotice?: number;
}

export interface UpdateEventData extends CreateEventData {
	id: number;
}

export interface EventGroup {
	events: EventData[];
	title: string;
	showIfEmpty?: boolean;
}

export interface DashboardData {
	date: Date;
	events: EventData[];
}
