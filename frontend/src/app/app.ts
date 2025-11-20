import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { HttpClientModule } from "@angular/common/http";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, Dashboard, HttpClientModule],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {}
