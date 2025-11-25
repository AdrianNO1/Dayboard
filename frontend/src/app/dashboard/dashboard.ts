import { Component, computed, Signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { dateToString, generateGroups, toDate } from "../utils";
import { CardGroup } from "../card-group/card-group";
import { MatIconModule } from "@angular/material/icon";
import { Settings } from "../settings/settings";
import { Modal } from "../modal/modal";
import { EventGroup, DashboardData } from "../types";
import { CreateQueryResult, injectQuery } from "@tanstack/angular-query-experimental";
import { HttpService } from "../http-service";

@Component({
	selector: "app-dashboard",
	imports: [CardGroup, MatIconModule, Settings, Modal],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {
	dashboardData?: DashboardData;
	groupGroups: Signal<EventGroup[]>;
	isSettingsOpen: boolean = false;
	router: Router;
	route: ActivatedRoute;
	dashboardDataQuery: CreateQueryResult<EventGroup[], Error>;

	constructor(httpService: HttpService, router: Router, route: ActivatedRoute) {
		this.router = router;
		this.route = route;

		const dateParam = this.route.snapshot.queryParamMap.get("date");
		let day = dateParam ? toDate(dateParam) : new Date();

		if (!dateParam || !day) {
			if (!day) {
				day = new Date();
			}
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: { date: dateToString(day) },
				queryParamsHandling: "merge",
				replaceUrl: true,
			});
		}

		this.dashboardDataQuery = injectQuery(() => ({
			queryKey: ["dashboardData"],
			queryFn: () => httpService.getDashboardData(day),
			select: (data: DashboardData) => generateGroups(data.events, day),
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
