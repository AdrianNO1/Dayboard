import { Component, HostListener, Input } from "@angular/core";
import { EventData } from "../types";

@Component({
	selector: "app-card",
	imports: [],
	templateUrl: "./card.html",
	styleUrl: "./card.scss",
})
export class Card {
	@Input() data?: EventData;

	get backgroundColor() {
		return "#2196f3";
	}

	get title() {
		if (this.data) {
			return this.data.date.toLocaleDateString("no-NO");
		}
		return "";
	}

	constructor() {}

	contextMenuVisible = false;
	contextMenuX = 0;
	contextMenuY = 0;

	onRightClick(event: MouseEvent) {
		event.preventDefault();
		this.contextMenuVisible = true;
		this.contextMenuX = event.clientX;
		this.contextMenuY = event.clientY;
	}

	@HostListener("document:click")
	hideMenu() {
		this.contextMenuVisible = false;
	}

	onSnooze() {
		console.log("snooozed");
		this.hideMenu();
	}
}
