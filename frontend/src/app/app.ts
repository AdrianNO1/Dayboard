import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Card } from "./card/card";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, Card],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {}
