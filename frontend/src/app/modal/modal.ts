import { Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "app-modal",
	imports: [],
	templateUrl: "./modal.html",
	styleUrl: "./modal.scss",
})
export class Modal {
	@Output() onClose = new EventEmitter<void>();

	close() {
		this.onClose.emit();
	}
}
