import { EventType } from "./types";

export const WEATHER_EMBED_URL = "https://www.yr.no/nb/innhold/1-92416/meteogram.svg";
export const NORSK_KALENDER_URL = "https://www.norskkalender.no/";

export const EVENT_TYPE_STYLES: Record<EventType, Record<string, string>> = {
	Birthday: {
		"background-color": "#000000",
		color: "#FF0000",
	},
	World: {
		"background-color": "#87c950",
		color: "#FFFFFF",
	},
	Reminder: {
		"background-color": "#2196f3",
		color: "#FFFFFF",
	},
	Email: {
		"background-color": "#FFFFFF",
		color: "#000000",
	},
	Storage: {
		"background-color": "#FF0000",
		color: "#FFFFFF",
	},
};

export const RED_DAY_STYLE = {
	"background-color": "#f06292",
	color: "#FFFFFF",
};

export const BIRTHDAY_SUFFIX: string = " har bursdag!!";
