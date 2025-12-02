import { EventData, EventGroup, ManualEventData } from "./types";
import { RRule } from "RRule";

function stealCards<T>(cardsList: T[], stealFunc: (e: T) => boolean): T[] {
	const stolen: T[] = [];
	for (let i = cardsList.length - 1; i >= 0; i--) {
		const card = cardsList[i];
		if (stealFunc(card)) {
			cardsList.splice(i, 1);
			stolen.push(card);
		}
	}
	return stolen;
}

export function isManualEvent(e: EventData) {
	return e.eventType !== "Email";
}

export function generateGroups(eventData: EventData[], today: Date): EventGroup[] {
	const manualEvents = eventData.filter(isManualEvent);
	const normalized = normalizeEventDateToSameDateType(manualEvents, today);

	const emailEvents = eventData.filter((event) => event.eventType === "Email");
	const todayEvents = stealCards(normalized, (card) => areDatesOnSameDay(card.date, today));
	const tomorrowEvents = stealCards(normalized, (card) =>
		areDatesOnSameDay(card.date, addDays(today, 1)),
	);

	return [
		{
			title: "Today",
			events: todayEvents,
			showIfEmpty: true,
		},
		{
			title: "Emails",
			events: emailEvents,
		},
		{
			title: "Tomorrow",
			events: tomorrowEvents,
		},
		{
			title: "Upcoming",
			events: normalized,
			showIfEmpty: true,
		},
	];
}

export function normalizeEventDateToSameDateType(
	eventData: ManualEventData[],
	day: Date,
	daysNoticeOverwrite?: number,
): ManualEventData[] {
	const normalized: ManualEventData[] = [];
	for (const event of deepCopy(eventData)) {
		switch (event.dateType) {
			case "Dateyear":
				event.dateType = "Dateyear";
				normalized.push(event);
				break;
			case "Date":
				event.dateType = "Dateyear";
				let fullDateStr = event.date + "-" + day.getFullYear();
				const fullDate = stringToDate(fullDateStr);
				if (!fullDate) {
					throw new Error("Invalid date");
				}
				if (fullDate < day) {
					fullDateStr = event.date + "-" + day.getFullYear() + 1;
				}
				event.date = fullDateStr;
				normalized.push(event);
				break;
			case "RRule":
				const rrule = RRule.fromString(event.date);
				const occurrences = rrule.between(addDays(day, -1), addDays(day, event.daysNotice));
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

export function getAllEventOccurencesInYear(eventData: ManualEventData[], year: number) {
	const DAYS_IN_YEAR = 365;
	const MARGIN = 3;
	const yearStart = new Date(year, 0, 1);
	return normalizeEventDateToSameDateType(eventData, yearStart, DAYS_IN_YEAR + MARGIN).filter(
		(event) => stringToDate(event.date)?.getFullYear() === year,
	);
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

export function ensureDate(date: string | Date): Date {
	if (typeof date === "string") {
		const dateOrUndefined = stringToDate(date);
		if (!dateOrUndefined) {
			throw new Error("Invalid date");
		}
		date = dateOrUndefined;
	}
	return date;
}

export function getOrdinal(n: number) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatDateAsShortTitle(date: string | Date) {
	date = ensureDate(date);
	const day = date.getDate();
	let month = date.toLocaleString("en-US", { month: "short" });
	return `${getOrdinal(day)} ${month}`;
}

export function formatDateAsLongTitle(date: string | Date) {
	date = ensureDate(date);
	if (typeof date === "string") {
		const dateOrUndefined = stringToDate(date);
		if (!dateOrUndefined) {
			throw new Error("Invalid date");
		}
		date = dateOrUndefined;
	}
	const day = date.getDate();
	let month = date.toLocaleString("en-US", { month: "long" });
	return `${getOrdinal(day)} ${month}`;
}

export function capitalize(str: string) {
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(text: string, maxChars: number, suffix: string = "..."): string {
	if (text.length > maxChars) {
		return text.slice(0, maxChars - suffix.length) + suffix;
	}
	return text;
}
