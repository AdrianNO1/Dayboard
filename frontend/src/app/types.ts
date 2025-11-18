enum CardType {
	Birthday,
	Reminder,
	Email,
	World,
}

interface CardData {
	text: string;
	date: Date;
	type?: CardType;
}

interface CardGroupData {
	cardData: CardData[];
	title: string;
}

interface DashboardData {
	cardData: CardData[];
}
