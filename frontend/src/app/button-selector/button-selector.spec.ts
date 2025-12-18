import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ButtonSelector } from "./button-selector";

describe("ButtonSelector", () => {
	let component: ButtonSelector<unknown>;
	let fixture: ComponentFixture<ButtonSelector<unknown>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ButtonSelector],
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonSelector);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
