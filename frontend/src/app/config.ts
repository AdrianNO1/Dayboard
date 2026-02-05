import { EventType } from "./types";

export const WEATHER_EMBED_URL = "https://www.yr.no/nb/innhold/1-92416/meteogram.svg";

export const EVENT_TYPE_STYLES: Record<EventType, Record<string, string>> = {
	Birthday: {
		backgroundColor: "#000000",
		color: "#FF0000",
	},
	World: {
		backgroundColor: "#87c950",
		color: "#FFFFFF",
	},
	Reminder: {
		backgroundColor: "#2196f3",
		color: "#FFFFFF",
	},
	Email: {
		backgroundColor: "#FFFFFF",
		color: "#000000",
	},
	Storage: {
		backgroundColor: "#FF0000",
		color: "#FFFFFF",
	},
};

export const BIRTHDAY_SUFFIX: string = " har bursdag!!";
