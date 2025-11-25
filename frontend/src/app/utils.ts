import { Router } from "@angular/router";
import { EventData, EventGroup } from "./types";
import { RRule } from "RRule";

export function generateGroups(cardData: EventData[], today: Date): EventGroup[] {
	const normalized = normalizeEventDateToSameDateType(cardData, today)
	const todayCards = normalized.filter((card) => areDatesOnSameDay(card.date, today));
	const tomorrowCards = normalized.filter((card) =>
		areDatesOnSameDay(card.date, addDays(today, 1)),
	);

	const otherCards = normalized.filter((card) => ![...todayCards, ...tomorrowCards].includes(card));
	return [
		{
			title: "Today",
			events: todayCards,
		},
		{
			title: "Tomorrow",
			events: tomorrowCards,
		},
		{
			title: "Upcoming",
			events: otherCards,
		},
	];
}

export function normalizeEventDateToSameDateType(eventData: EventData[], today: Date): EventData[] {
	const normalized: EventData[] = []
	console.log(eventData)
	for (const event of deepCopy(eventData)) {
		switch (event.dateType) {
			case "Dateyear":
				event.dateType = "Dateyear"
				normalized.push(event)
				break;
			case "Date":
				event.dateType = "Dateyear"
				event.date = event.date + "-" + today.getFullYear()
				normalized.push(event)
				break;
			case "RRule":
				const rrule = RRule.fromString(event.date)
				const occurrences = rrule.between(addDays(today, -1), addDays(today, event.daysNotice))
				for (const occurence of occurrences) {
					const eventCopy = deepCopy(event)
					eventCopy.dateType = "Dateyear"
					eventCopy.date = dateToString(occurence)
					normalized.push(eventCopy)
				}
		}
	}
	console.log(normalized)
	return normalized
}

export function deepCopy<T extends object>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

export function areDatesOnSameDay(date1: Date | string | undefined, date2: Date) {
	if (!date1 || typeof date1 === "string") {
		date1 = toDate(date1 ?? "")
		if (!date1) {
			throw new Error("Invalid date")
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

export function toDate(dateString: string): Date | undefined {
	const [d, m, y] = (dateString.split("-")[0].length === 4 ? dateString.split("-").reverse() : dateString.split("-")).map(Number);
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

export function toNorwayFormatDate(date: Date | string | null) {
	if (typeof date === "string") {
		date = toDate(date) ?? null
	}

	return date?.toLocaleDateString("no-NO", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}) ?? "Invalid Date";
}