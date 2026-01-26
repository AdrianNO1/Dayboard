import { Component, computed, Signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { dateToString, formatDateAsLongTitle, generateGroups, stringToDate } from "../utils";
import { CardGroup } from "../card-group/card-group";
import { MatIconModule } from "@angular/material/icon";
import { Settings } from "../settings/settings";
import { Modal } from "../modal/modal";
import { EventGroup, DashboardData, ManualEventData, EventGroupData } from "../types";
import { EventForm } from "../event-form/event-form";
import { CreateQueryResult, injectQuery } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";
import { Weather } from "../weather/weather";
import { Title } from "@angular/platform-browser";
import { offlineMode } from "../http-interceptor";

@Component({
	selector: "app-dashboard",
	imports: [CardGroup, MatIconModule, Settings, Modal, Weather, EventForm],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {
	dashboardData?: DashboardData;
	groupGroups: Signal<EventGroup[]>;
	isSettingsOpen: boolean = false;
	dashboardDataQuery: CreateQueryResult<EventGroup[], Error>;
	offlineMode = offlineMode;
	initialized: boolean = false;

	isEventFormModalOpen = false;
	eventFormModalIsEdit = false;
	eventFormModalInitialData?: ManualEventData;

	openEventEditModal(clickedEvent: EventGroupData): void {
		if (!clickedEvent.id) {
			console.error("Cannot edit event without ID", clickedEvent);
			return;
		}
		this.isEventFormModalOpen = true;
		this.eventFormModalIsEdit = true;
		this.eventFormModalInitialData = clickedEvent as unknown as ManualEventData;
	}

	closeNewEventModal(): void {
		this.isEventFormModalOpen = false;
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		httpService: HttpService,
		titleService: Title,
	) {
		const dateParam = new URLSearchParams(window.location.search).get("date");
		let day = (dateParam && stringToDate(dateParam)) || new Date();

		if (dateParam != dateToString(day)) {
			const dayString = dateToString(day);
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: { date: dayString },
				queryParamsHandling: "merge",
				replaceUrl: true,
			});
		}
		titleService.setTitle(formatDateAsLongTitle(day));

		this.dashboardDataQuery = injectQuery(() => ({
			queryKey: ["dashboardData"],
			queryFn: () => {
				if (this.initialized) {
					return httpService.getDashboardData(day, false)
				}
				return httpService.getDashboardData(day, true)
			},
			select: (data: DashboardData) => {
				if (this.initialized && this.dashboardData) {
					data.emails = [...this.dashboardData.emails];
				}
				this.initialized = true;
				this.dashboardData = data
				return generateGroups(data, day)
			},
			refetchOnWindowFocus: false,
		}));

		this.groupGroups = computed(() => {
			return this.dashboardDataQuery.data() || [];
		});
	}

	openSettings() {
		this.isSettingsOpen = true;
	}

	closeSettings() {
		this.isSettingsOpen = false;
	}
}
