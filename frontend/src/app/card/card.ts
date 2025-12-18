import { Component, HostListener, Input } from "@angular/core";
import { EventData, EventGroupData } from "../types";
import { formatDateAsShortTitle, getEventUrl } from "../utils";
import { EVENT_TYPE_STYLES } from "../config";

@Component({
	selector: "app-card",
	imports: [],
	templateUrl: "./card.html",
	styleUrl: "./card.scss",
})
export class Card {
	// Inputs
	@Input() data?: EventGroupData;

	// Context menu state
	contextMenuVisible: boolean = false;
	contextMenuX: number = 0;
	contextMenuY: number = 0;

	// Computed properties
	get title(): string {
		if (this.data?.eventType === "Email") {
			return (this.data.sender ? this.data.sender + " - " : "") + this.data.eventText;
		}
		if (this.data?.date) {
			return formatDateAsShortTitle(this.data.date);
		}
		return "";
	}

	get eventText(): string | undefined {
		if (this.data?.eventType === "Email") {
			return undefined;
		}
		return this.data?.eventText;
	}

	get eventHref(): string | null {
		return this.data ? getEventUrl(this.data) : null;
	}

	// Event handlers
	onRightClick(event: MouseEvent): void {
		event.preventDefault();
		this.contextMenuVisible = true;
		this.contextMenuX = event.clientX;
		this.contextMenuY = event.clientY;
	}

	@HostListener("document:click")
	hideMenu(): void {
		this.contextMenuVisible = false;
	}

	onSnooze(): void {
		console.log("snoozed");
		this.hideMenu();
	}

	// Style helper
	getEventStyles(): Record<string, string> | null {
		return this.data ? EVENT_TYPE_STYLES[this.data.eventType] : null;
	}
}
