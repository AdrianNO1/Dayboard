import { EventData, EventGroup } from "./types";
import { RRule } from "RRule";

function stealCards(cardsList: EventData[], stealFunc: (e: EventData) => boolean): EventData[] {
	const stolen: EventData[] = [];
	for (let i = 0; i < cardsList.length; i++) {
		const card = cardsList[i - stolen.length];
		if (stealFunc(card)) {
			cardsList.splice(i, 1);
			stolen.push(card);
		}
	}
	return stolen;
}

export function generateGroups(cardData: EventData[], today: Date): EventGroup[] {
	const normalized = normalizeEventDateToSameDateType(cardData, today);

	const emailCards = stealCards(normalized, (card) => card.eventType === "Email");
	const todayCards = stealCards(normalized, (card) => areDatesOnSameDay(card.date, today));
	const tomorrowCards = stealCards(normalized, (card) =>
		areDatesOnSameDay(card.date, addDays(today, 1)),
	);

	return [
		{
			title: "Today",
			events: todayCards,
			showIfEmpty: true,
		},
		{
			title: "Emails",
			events: emailCards,
		},
		{
			title: "Tomorrow",
			events: tomorrowCards,
		},
		{
			title: "Upcoming",
			events: normalized,
			showIfEmpty: true,
		},
	];
}

export function normalizeEventDateToSameDateType(eventData: EventData[], today: Date): EventData[] {
	const normalized: EventData[] = [];
	console.log(eventData);
	for (const event of deepCopy(eventData)) {
		switch (event.dateType) {
			case "Dateyear":
				event.dateType = "Dateyear";
				normalized.push(event);
				break;
			case "Date":
				event.dateType = "Dateyear";
				event.date = event.date + "-" + today.getFullYear();
				normalized.push(event);
				break;
			case "RRule":
				const rrule = RRule.fromString(event.date);
				const occurrences = rrule.between(
					addDays(today, -1),
					addDays(today, event.daysNotice),
				);
				for (const occurence of occurrences) {
					const eventCopy = deepCopy(event);
					eventCopy.dateType = "Dateyear";
					eventCopy.date = dateToString(occurence);
					normalized.push(eventCopy);
				}
		}
	}
	normalized.sort((a, b) => stringToDate(a.date)!.getTime() - stringToDate(b.date)!.getTime());
	return normalized;
}

export function deepCopy<T extends object>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function areDatesOnSameDay(date1: Date | string | undefined, date2: Date) {
	if (!date1 || typeof date1 === "string") {
		date1 = stringToDate(date1 ?? "");
		if (!date1) {
			throw new Error("Invalid date");
		}
	}
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

export function stringToDate(dateString: string): Date | undefined {
	const [d, m, y] = (
		dateString.split("-")[0].length === 4
			? dateString.split("-").reverse()
			: dateString.split("-")
	).map(Number);
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

	return `${year}-${month}-${day}`;
}

export function getOrdinal(n: number) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatDateAsTitle(date: string | Date) {
	if (typeof date === "string") {
		const dateOrUndefined = stringToDate(date);
		if (!dateOrUndefined) {
			throw new Error("Invalid date");
		}
		date = dateOrUndefined;
	}
	const day = date.getDate();
	const month = date.toLocaleString("en-GB", { month: "short" }).toLowerCase();
	return `${getOrdinal(day)} ${month}`;
}
