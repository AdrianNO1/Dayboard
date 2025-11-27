import { EventType } from "./types";

export const WEATHER_EMBED_URL = "https://www.yr.no/nb/innhold/1-92416/meteogram.svg";

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
};
