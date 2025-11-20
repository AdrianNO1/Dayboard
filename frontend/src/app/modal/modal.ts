import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-modal",
	imports: [],
	templateUrl: "./modal.html",
	styleUrl: "./modal.scss",
})
export class Modal {
	@Input() width: string = "80vw";
	@Input() height: string = "80vh";
	@Output() onClose = new EventEmitter<void>();

	close() {
		this.onClose.emit();
	}
}
