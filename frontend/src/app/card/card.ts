import { Component, HostListener, Input } from "@angular/core";
import { EventData } from "../types";
import { formatDateAsShortTitle } from "../utils";
import { EVENT_TYPE_STYLES, INSTANT_EVENT_TYPES } from "../config";

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

	get textColor() {
		return null;
	}

	get title() {
		if (this.data?.eventTitle) {
			return this.data.eventTitle;
		}
		if (this.data?.date && !INSTANT_EVENT_TYPES.has(this.data.eventType)) {
			return formatDateAsShortTitle(this.data.date);
		}
		return "";
	}

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

	getEventStyles() {
		return this.data ? EVENT_TYPE_STYLES[this.data.eventType] : null;
	}
}
