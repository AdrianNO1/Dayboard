import {
	Component,
	computed,
	EventEmitter,
	Input,
	Output,
	signal,
	Signal,
	WritableSignal,
} from "@angular/core";
import { EventType, ManualEventData } from "../types";
import { EventTypeSelector } from "../button-selector/button-selector";
import {
	capitalize,
	formatDateAsShortTitle,
	getAllEventOccurrencesInYear,
	getOrdinal,
	stringToDate,
	truncateText,
} from "../utils";
import { BIRTHDAY_SUFFIX, EVENT_TYPE_STYLES } from "../config";

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
	allEventTypes: EventType[] = ["Birthday", "Reminder", "World"];
	shownEventTypes: WritableSignal<EventType[]> = signal(this.allEventTypes);

	year = signal<number>(new Date().getFullYear());

	@Input() allEventsData: Signal<ManualEventData[] | undefined> = signal(undefined);
	@Output() onEventClick = new EventEmitter<ManualEventData>();

	monthGroups: Signal<MonthGroup[]> = computed(() => {
		const events = this.allEventsData() || [];
		const thisYear = getAllEventOccurrencesInYear(events, this.year()).filter((e) =>
			this.shownEventTypes().includes(e.eventType),
		);

		const monthGroups: MonthGroup[] = [];
		for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
			const firstDayOfMonth = new Date(this.year(), monthIndex, 1);
			monthGroups.push({
				firstDayOfMonth,
				events: thisYear.filter((e) => stringToDate(e.date)?.getMonth() === monthIndex),
			});
		}
		return monthGroups;
	});

	toggleEventTypeOption(option: EventType) {
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
		return capitalize(monthName) + " " + this.year();
	}

	getMonthEventCircleColor(eventType: EventType): string {
		return EVENT_TYPE_STYLES[eventType]["background-color"];
	}

	getMonthEventDateText(event: ManualEventData): string {
		const date = stringToDate(event.date);
		if (!date) {
			return "";
		}
		const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
		let eventShortText = event.eventText;
		if (event.eventType === "Birthday" && eventShortText.endsWith(BIRTHDAY_SUFFIX)) {
			eventShortText = eventShortText.slice(0, eventShortText.length - BIRTHDAY_SUFFIX.length)
		}
		return `${getOrdinal(date.getDate())} | ${weekday} | ${eventShortText}`;
	}

	updateYear(year: number) {
		this.year.set(year);
	}
}
