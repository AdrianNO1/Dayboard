// npm i astronomy-engine
import * as Astronomy from "astronomy-engine";

export type PrecomputedEvent = {
	eventText: string;
	dateType: "Dateyear";
	date: string; // YYYY-MM-DD in Europe/Oslo (Bergen local date)
	isRedDay: boolean;
};

const OSLO_TZ = "Europe/Oslo";
const DAY_MS = 24 * 60 * 60 * 1000;

function isoDateInTimeZone(dateUtc: Date, timeZone = OSLO_TZ): string {
	// en-CA reliably formats as YYYY-MM-DD in most Node builds with full-icu
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(dateUtc);
}

function addDays(dateUtcNoon: Date, days: number): Date {
	return new Date(dateUtcNoon.getTime() + days * DAY_MS);
}

// Meeus/Jones/Butcher Gregorian algorithm
function easterSundayUtcNoon(year: number): Date {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar, 4=Apr
	const day = ((h + l - 7 * m + 114) % 31) + 1;

	// Use UTC noon to avoid any DST/local-midnight edge cases when later formatting in Europe/Oslo.
	return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function precomputeCustomNorwayDaysNext20Years(fromYear = new Date().getUTCFullYear()): PrecomputedEvent[] {
	const events: PrecomputedEvent[] = [];

	for (let year = fromYear; year < fromYear + 20; year++) {
		const easter = easterSundayUtcNoon(year);

		const push = (eventText: string, dateUtcNoon: Date, isRedDay: boolean) => {
			events.push({
				eventText,
				dateType: "Dateyear",
				date: isoDateInTimeZone(dateUtcNoon, OSLO_TZ),
				isRedDay
			});
		};

		// Norway red days (movable; Easter-based)
		push("Maundy Thursday (Skjærtorsdag)", addDays(easter, -3), true);
		push("Good Friday (Langfredag)", addDays(easter, -2), true);
		push("Easter Sunday (Påskedag)", addDays(easter, 0), true);
		push("Easter Monday (2. påskedag)", addDays(easter, +1), true);
		push("Ascension Day (Kristi himmelfartsdag)", addDays(easter, +39), true);
		push("Pentecost / Whit Sunday (1. pinsedag)", addDays(easter, +49), true);
		push("Whit Monday (2. pinsedag)", addDays(easter, +50), true);

		// Extra Easter-based days you asked for (not red days)
		push("Palm Sunday", addDays(easter, -7), false);
		push("Ash Wednesday", addDays(easter, -46), false);
		push("Trinity Sunday", addDays(easter, +56), false);

		// Equinoxes/Solstices (global instants -> Bergen local date via Europe/Oslo timezone)
		const s = Astronomy.Seasons(year);
		push("March Equinox (Bergen local date)", s.mar_equinox.date, false);
		push("June Solstice (Bergen local date)", s.jun_solstice.date, false);
		push("September Equinox (Bergen local date)", s.sep_equinox.date, false);
		push("December Solstice (Bergen local date)", s.dec_solstice.date, false);
	}

	events.sort((a, b) => a.date.localeCompare(b.date) || a.eventText.localeCompare(b.eventText));
	return events;
}
