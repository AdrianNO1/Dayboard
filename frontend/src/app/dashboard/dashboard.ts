import { Component, computed, Signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { dateToString, formatDateAsLongTitle, generateGroups, stringToDate } from "../utils";
import { CardGroup } from "../card-group/card-group";
import { MatIconModule } from "@angular/material/icon";
import { Settings } from "../settings/settings";
import { Modal } from "../modal/modal";
import { EventGroup, DashboardData } from "../types";
import { CreateQueryResult, injectQuery } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";
import { Weather } from "../weather/weather";
import { Title } from "@angular/platform-browser";
import { offlineMode } from "../http-interceptor";

@Component({
	selector: "app-dashboard",
	imports: [CardGroup, MatIconModule, Settings, Modal, Weather],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {
	// State
	dashboardData?: DashboardData;
	isSettingsOpen: boolean = false;
	initialized: boolean = false;
	offlineMode = offlineMode;

	// Data query
	dashboardDataQuery: CreateQueryResult<EventGroup[], Error>;
	groupGroups: Signal<EventGroup[]>;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		httpService: HttpService,
		titleService: Title,
	) {
		const dateParam = new URLSearchParams(window.location.search).get("date");
		let day = (dateParam && stringToDate(dateParam)) || new Date();

		if (dateParam !== dateToString(day)) {
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
					return httpService.getDashboardData(day, false);
				}
				return httpService.getDashboardData(day, true);
			},
			select: (data: DashboardData) => {
				if (this.initialized && this.dashboardData) {
					data.emails = [...this.dashboardData.emails];
				}
				this.initialized = true;
				this.dashboardData = data;
				return generateGroups(data, day);
			},
			staleTime: 5 * 60 * 60 * 1000
		}));

		this.groupGroups = computed(() => {
			return this.dashboardDataQuery.data() || [];
		});
	}

	openSettings(): void {
		this.isSettingsOpen = true;
	}

	closeSettings(): void {
		this.isSettingsOpen = false;
	}
}
