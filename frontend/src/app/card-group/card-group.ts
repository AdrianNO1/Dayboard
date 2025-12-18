import { Component, Input } from "@angular/core";
import { Card } from "../card/card";
import { EventGroup } from "../types";

@Component({
	selector: "app-card-group",
	imports: [Card],
	templateUrl: "./card-group.html",
	styleUrl: "./card-group.scss",
})
export class CardGroup {
	@Input() group?: EventGroup;

	get title(): string {
		return this.group?.title || "";
	}

	get cards(): EventGroup["events"] {
		return this.group?.events || [];
	}
}
