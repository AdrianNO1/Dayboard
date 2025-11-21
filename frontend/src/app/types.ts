export type EventType = "Birthday" | "Reminder" | "Email" | "World";

export interface EventData {
	text: string;
	date: Date;
	type?: EventType;
}

export type EventDateType = "Date" | "Dateyear" | "RRule" | "Onetime";

export interface EventGroupData {
	eventData: EventData[];
	title: string;
}

export interface DashboardData {
	eventData: EventData[];
}

export interface CreateEventApiBody {
	eventType: EventType;
	eventText: string;
	date: string;
	dateType: EventDateType;
}
