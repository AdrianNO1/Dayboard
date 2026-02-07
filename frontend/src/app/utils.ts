import {
	DashboardData,
	Email,
	EventData,
	EventGroup,
	EventGroupData,
	ManualEventData,
} from "./types";
import { RRule } from "RRule";
import { DAYS_IN_YEAR, EMAIL_LOOKBACK_DAYS } from "./constants";

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


export function generateGroups(data: DashboardData, date: Date): EventGroup[] {
	const eventData = data.events
	const normalized = normalizeEventDateToSameDateType(eventData, date);

	const todayEvents = stealCards(normalized, (card) => areDatesOnSameDay(card.date, date));
	const tomorrowEvents = stealCards(normalized, (card) =>
		areDatesOnSameDay(card.date, addDays(date, 1)),
	);

	const emailEvents: EventGroupData[] = data.emails.map((email: Email) => {
		return {...email, eventType: "Email"}
	})

	let todayTitle = "Today"
	let tomorrowTitle = "Tomorrow"
	if (!areDatesOnSameDay(new Date(), date)) {
		todayTitle = formatDateAsLongTitle(date)
		tomorrowTitle = formatDateAsLongTitle(addDays(date, 1))
	}
	if (!areDatesOnSameDay(data.date, date)) {
		todayTitle = "DATE MISMATCH" + "!".repeat(130)
		tomorrowTitle = todayTitle
	}


	return [
		{
			title: todayTitle,
			events: todayEvents,
			showIfEmpty: true,
		},
		{
			title: "Emails",
			events: emailEvents,
		},
		{
			title: tomorrowTitle,
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

				const dayAtMidnight = new Date(day);
				dayAtMidnight.setHours(0, 0, 0, 0);

				if (fullDate < dayAtMidnight) {
					fullDateStr = event.date + "-" + (day.getFullYear() + 1);
				}
				event.date = fullDateStr;
				normalized.push(event);
				break;
			case "RRule":
				const rrule = RRule.fromString(event.date);
				const occurrences = rrule.between(addDays(day, -1), addDays(day, daysNoticeOverwrite || event.daysNotice));
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

export function getAllEventOccurrencesInYear(eventData: ManualEventData[], year: number): ManualEventData[] {
	const MARGIN = 3;
	const yearStart = new Date(year, 0, 1);
	return normalizeEventDateToSameDateType(eventData, yearStart, DAYS_IN_YEAR + MARGIN).filter(
		(event) => stringToDate(event.date)?.getFullYear() === year,
	);
}

export function deepCopy<T extends object>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function areDatesOnSameDay(date1: Date | string | undefined, date2: Date): boolean {
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

export function addDays(date: Date, days: number): Date {
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

export function getOrdinal(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatDateAsShortTitle(date: string | Date): string {
	date = ensureDate(date);
	const day = date.getDate();
	let month = date.toLocaleString("en-US", { month: "short" });
	return `${getOrdinal(day)} ${month}`;
}

export function formatDateAsLongTitle(date: string | Date): string {
	date = ensureDate(date);
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

export function generateRandomKey(): string {
	return new Date().toISOString() + "__" + Math.floor(Math.random() * 10 ** 8);
}

export function getEmailUrl(eventTitle: string): string {
	const searchParam: string = encodeURIComponent(eventTitle);
	const dateStart = dateToString(addDays(new Date(), -EMAIL_LOOKBACK_DAYS - 1));
	return `https://mail.google.com/mail/u/0/#advanced-search/query=${searchParam}+++++++&isrefinement=true&datestart=${dateStart}&daterangetype=custom_range`;
}

export function getEventUrl(event: EventGroupData): string | null {
	if (event.eventType === "Email") {
		return getEmailUrl(event.eventText);
	}
	const match = event.eventText.match(/\bhttps?:\/\/[^\s<>"')\]]+/i);
	return match ? match[0] : null;
}
