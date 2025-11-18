export function generateGroups(cardData: CardData[], today: Date): CardGroupData[] {
	const todayCards = cardData.filter((card) => areDatesOnSameDay(card.date, today));
	const tomorrowCards = cardData.filter((card) =>
		areDatesOnSameDay(card.date, addDays(today, 1)),
	);

	const otherCards = cardData.filter((card) => ![...todayCards, ...tomorrowCards].includes(card));
	return [
		{
			title: "Today",
			cardData: todayCards,
		},
		{
			title: "Tomorrow",
			cardData: tomorrowCards,
		},
		{
			title: "Upcoming",
			cardData: otherCards,
		},
	];
}

export function areDatesOnSameDay(date1: Date, date2: Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

export function addDays(date: Date, days: number) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function toDate(dateString: string): Date | undefined {
	const [d, m, y] = dateString.split("-").map(Number);
	const date = new Date(y, m - 1, d);
	if (isNaN(date.getTime())) {
		return undefined;
	}
	return date;
}

export function dateToString(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}
