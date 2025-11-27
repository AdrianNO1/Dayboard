import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventDateType, ManualEventType } from "../types";

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
	@Input() selectedOption?: T;
	@Output() selectedOptionChange = new EventEmitter<T>();

	selectOption(option: T) {
		this.selectedOptionChange.emit(option);
	}
}

@Component({
	selector: "app-event-type-selector",
	imports,
	templateUrl,
	styleUrl,
})
export class EventTypeSelector extends ButtonSelector<ManualEventType> {}

@Component({
	selector: "app-event-date-type-selector",
	imports,
	templateUrl,
	styleUrl,
})
export class EventDateTypeSelector extends ButtonSelector<EventDateType> {}
