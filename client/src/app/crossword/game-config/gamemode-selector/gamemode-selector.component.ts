import { Component, Output, EventEmitter } from "@angular/core";
import { GameMode } from "../../../../../../common/crossword/constant";

@Component({
    selector: "app-gamemode-selector",
    templateUrl: "../option-selector.component.html",
    styleUrls: ["../option-selector.component.css"]
})

export class GameModeSelectorComponent {
    @Output() public selectedEvent: EventEmitter<GameMode>;

    public get numberOfOptions(): number {
        return this.options.length;
    }

    public get options(): string[] {
        const options: string[] = [];
        for (const mode in GameMode) {
            if (isNaN(Number(mode))) {
                options.push(mode);
            }
        }

        return options;
    }

    public constructor() {
        this.selectedEvent = new EventEmitter<GameMode>();
    }

    public onSelect(selectedMode: GameMode): void {
        this.selectedEvent.emit(selectedMode);
    }

}
