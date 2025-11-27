export type EventType = "Birthday" | "Reminder" | "Email" | "World";

export interface EventData {
	id: number;
	eventText: string;
	eventTitle?: string;
	eventType: EventType;
	date: string;
	dateType: EventDateType;
	daysNotice: number;
	createdAt: string;
	updatedAt: string;
}

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
