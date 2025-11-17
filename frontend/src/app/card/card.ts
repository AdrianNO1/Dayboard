import { Component, HostListener, Input } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-card",
	imports: [DatePipe],
	templateUrl: "./card.html",
	styleUrl: "./card.scss",
})
export class Card {
	@Input() backgroundColor: string = "#2196f3";
	date = new Date();
	message = "Here is some example text below the date.";

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
