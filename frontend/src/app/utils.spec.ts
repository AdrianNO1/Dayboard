import { getEventStyles, getEventUrl } from "./utils";
import { NORSK_KALENDER_URL } from "./config";
import { ManualEventData } from "./types";

describe("event helpers", () => {
	const makeWorldEvent = (date: string, redDay: boolean): ManualEventData => ({
		id: 1,
		eventText: "Holiday",
		eventType: "World",
		date,
		dateType: "Dateyear",
		daysNotice: 14,
		redDay,
		createdAt: "",
		updatedAt: "",
	});

	it("uses pink styling for weekday red days", () => {
		const styles = getEventStyles(makeWorldEvent("2026-04-02", true));
		expect(styles?.["background-color"]).toBe("#f06292");
	});

	it("keeps weekend red days green", () => {
		const styles = getEventStyles(makeWorldEvent("2026-04-05", true));
		expect(styles?.["background-color"]).toBe("#87c950");
	});

	it("links red days to Norsk Kalender", () => {
		expect(getEventUrl(makeWorldEvent("2026-04-02", true))).toBe(NORSK_KALENDER_URL);
	});
});
