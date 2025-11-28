import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllEventsView } from "./all-events-view";

describe("AllEventsView", () => {
	let component: AllEventsView;
	let fixture: ComponentFixture<AllEventsView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AllEventsView],
		}).compileComponents();

		fixture = TestBed.createComponent(AllEventsView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
