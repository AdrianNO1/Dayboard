export type ManualEventType = "Birthday" | "Reminder" | "World"
export type EventType = ManualEventType | "Email"

export type EventDateType = "Date" | "Dateyear" | "RRule" | "Custom";

interface EventDataTemplate<T> {
	id: number;
	eventText: string;
	eventType: T;
	date: string;
	dateType: EventDateType;
	daysNotice: number;
	createdAt: string;
	updatedAt: string;
}

export type ManualEventData = EventDataTemplate<EventType>

export interface Email {
	eventText: string;
	sender: string;
}

export type EventData = ManualEventData;

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

export interface EventGroupData {
	eventText: string;
	eventType: EventType | "Email";
	date?: string;
	sender?: string;
}

export interface EventGroup {
	events: EventGroupData[];
	title: string;
	showIfEmpty?: boolean;
}

export interface DashboardData {
	date: Date;
	events: EventData[];
	emails: Email[];
}
