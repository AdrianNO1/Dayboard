export type EventType = "Birthday" | "Reminder" | "Email" | "World";
export type ManualEventType = Exclude<EventType, "Email">;

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

export type ManualEventData = EventDataTemplate<ManualEventType>

export interface Email {
	eventTitle: string;
	eventText: string;
	eventType: "Email";
	link: string;
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
