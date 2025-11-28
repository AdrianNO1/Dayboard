import { Component, computed, signal, Signal, WritableSignal } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";
import { EventType, ManualEventData, ManualEventType } from "../types";
import { EventTypeSelector } from "../button-selector/button-selector";
import {
	capitalize,
	formatDateAsShortTitle,
	getAllEventOccurencesInYear,
	getOrdinal,
	stringToDate,
	truncateText,
} from "../utils";
import { EVENT_TYPE_STYLES } from "../config";

interface MonthGroup {
	firstDayOfMonth: Date;
	events: ManualEventData[];
}

@Component({
	selector: "app-all-events-view",
	imports: [EventTypeSelector],
	templateUrl: "./all-events-view.html",
	styleUrl: "./all-events-view.scss",
})
export class AllEventsView {
	allEventTypes: ManualEventType[] = ["Birthday", "Reminder", "World"];
	shownEventTypes: WritableSignal<ManualEventType[]> = signal(this.allEventTypes);

	year: number = new Date().getFullYear();

	allEventsDataQuery = injectQuery(() => ({
		queryKey: ["allEventsData"],
		queryFn: () => this.httpService.getAllEventsData(),
	}));

	monthGroups: Signal<MonthGroup[]> = computed(() => {
		const events = this.allEventsDataQuery.data() || [];
		const thisYear = getAllEventOccurencesInYear(events, this.year).filter((e) =>
			this.shownEventTypes().includes(e.eventType),
		);

		const monthGroups: MonthGroup[] = [];
		for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
			const firstDayOfMonth = new Date(this.year, monthIndex, 1);
			monthGroups.push({
				firstDayOfMonth,
				events: thisYear.filter((e) => stringToDate(e.date)?.getMonth() === monthIndex),
			});
		}
		return monthGroups;
	});

	constructor(private httpService: HttpService) {}

	toggleEventTypeOption(option: ManualEventType) {
		if (this.shownEventTypes().includes(option)) {
			this.shownEventTypes.update((shownEventTypes) =>
				shownEventTypes.filter((e) => e !== option),
			);
		} else {
			this.shownEventTypes.update((shownEventTypes) => [...shownEventTypes, option]);
		}
	}

	getMonthGroupTitle(monthGroup: MonthGroup): string {
		const date = monthGroup.firstDayOfMonth;
		const monthName = date.toLocaleString("en-US", { month: "long" });
		return capitalize(monthName) + " " + date.getFullYear();
	}

	getMonthEventCircleColor(eventType: ManualEventType): string {
		return EVENT_TYPE_STYLES[eventType]["background-color"];
	}

	getMonthEventDateText(event: ManualEventData): string {
		const date = stringToDate(event.date);
		if (!date) {
			return "";
		}
		const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
		const eventShortText = event.eventText;
		return `${getOrdinal(date.getDate())} | ${weekday} | ${eventShortText}`;
	}
}
