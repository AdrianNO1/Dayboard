export type CardType = "birthday" | "reminder" | "email" | "world";

export interface CardData {
	text: string;
	date: Date;
	type?: CardType;
}

export type CardDateType = "date" | "dateyear" | "rrule" | "onetime";

export interface CardGroupData {
	cardData: CardData[];
	title: string;
}

export interface DashboardData {
	cardData: CardData[];
}

export interface CreateEventApiBody {
	eventType: CardType;
	eventText: string;
	date: string;
	dateType: CardDateType;
}
