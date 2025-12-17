import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventDateType, EventType } from "../types";

const styleUrl = "./button-selector.scss";
const templateUrl = "./button-selector.html";
const imports: any = [];

@Component({
	selector: "app-button-selector",
	imports,
	templateUrl,
	styleUrl,
})
export class ButtonSelector<T> {
	@Input() options: T[] = [];
	@Input() selectedOptions: T[] = [];
	@Output() optionClicked = new EventEmitter<T>();

	selectOption(option: T) {
		this.optionClicked.emit(option);
	}

	isOptionSelected(option: T) {
		return this.selectedOptions.includes(option);
	}
}

@Component({
	selector: "app-event-type-selector",
	imports,
	templateUrl,
	styleUrl,
})
export class EventTypeSelector extends ButtonSelector<EventType> {}

@Component({
	selector: "app-event-date-type-selector",
	imports,
	templateUrl,
	styleUrl,
})
export class EventDateTypeSelector extends ButtonSelector<EventDateType> {}
