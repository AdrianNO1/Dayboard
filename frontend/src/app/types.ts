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
