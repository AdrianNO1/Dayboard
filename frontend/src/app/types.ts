export type EventType = "Birthday" | "Reminder" | "Email" | "World";
export type ManualEventType = Exclude<EventType, "Email">

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

export type EventData = ManualEventData | Email

export interface CreateEventData {
	eventText: string;
	eventType: EventType;
	date: string;
	dateType: EventDateType;
}

export type EventDateType = "Date" | "Dateyear" | "RRule";

export interface EventGroup {
	events: EventData[];
	title: string;
	showIfEmpty?: boolean;
}

export interface DashboardData {
	events: EventData[];
}
