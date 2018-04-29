import { Component, Output, EventEmitter } from "@angular/core";
import { GameDifficulty } from "../../../../../../common/crossword/constant";

@Component({
    selector: "app-difficulty-selector",
    templateUrl: "../option-selector.component.html",
    styleUrls: ["../option-selector.component.css"]
})

export class DifficultySelectorComponent {
    @Output() public selectedEvent: EventEmitter<GameDifficulty>;

    public get numberOfOptions(): number {
        return this.options.length;
    }

    public get options(): string[] {
        const options: string[] = [];
        for (const difficulty in GameDifficulty) {
            if (isNaN(Number(difficulty))) {
                options.push(difficulty);
            }
        }

        return options;
    }

    public constructor() {
        this.selectedEvent = new EventEmitter<GameDifficulty>();
    }

    public onSelect(difficulty: GameDifficulty): void {
        this.selectedEvent.emit(difficulty);
    }

}
