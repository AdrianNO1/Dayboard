import { Component } from "@angular/core";
import { DataService } from "../data-service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { dateToString, generateGroups, toDate } from "../utils";
import { CardGroup } from "../card-group/card-group";
import { MatIconModule } from "@angular/material/icon";
import { Settings } from "../settings/settings";
import { Modal } from "../modal/modal";

@Component({
	selector: "app-dashboard",
	imports: [CardGroup, MatIconModule, Settings, Modal],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {
	dashboardData?: DashboardData;
	groupGroups: CardGroupData[] = [];
	isSettingsOpen: boolean = false;

	constructor(dataService: DataService, router: Router) {
		const queryParamDay = new URLSearchParams(window.location.search).get("date");
		let day;
		if (queryParamDay) {
			day = toDate(queryParamDay);
		}
		if (!day) {
			day = new Date();
			router.navigate([], {
				queryParams: { date: dateToString(day) },
				queryParamsHandling: "merge",
			});
		}
		dataService.getDashboardData(day).subscribe((data) => {
			this.dashboardData = data;
			this.groupGroups = generateGroups(data.cardData, day);
			console.log(this.groupGroups);
		});
	}

	openSettings() {
		this.isSettingsOpen = true;
	}

	closeSettings() {
		this.isSettingsOpen = false;
	}
}
