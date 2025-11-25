export type EventType = "Birthday" | "Reminder" | "Email" | "World";

export interface EventData {
	eventText: string;
	eventType: EventType;
	date: string;
	dateType: EventDateType;
	daysNotice: number
}

export type CreateEventData = Omit<EventData, "daysNotice">

export type EventDateType = "Date" | "Dateyear" | "RRule";

export interface EventGroup {
	events: EventData[];
	title: string;
}

export interface DashboardData {
	events: EventData[];
}