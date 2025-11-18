import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CardGroup } from "./card-group/card-group";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, CardGroup],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {}
