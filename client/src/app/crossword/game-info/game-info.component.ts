import { Component, Input } from "@angular/core";
import { GameDifficulty, GameMode } from "../../../../../common/crossword/constant";

const PERCENTAGE_FACTOR: number = 100;
const MIN_BAR_LENGTH: number = 5;
const POINTS_BAR_BORDER_WIDTH: number = 2;

@Component({
    selector: "app-game-info",
    templateUrl: "./game-info.component.html",
    styleUrls: ["./game-info.component.css"]
})
export class GameInfoComponent {

    public gameModeType: typeof GameMode = GameMode;

    @Input("difficulty") public difficulty: GameDifficulty;
    @Input("mode") public mode: GameMode;
    @Input("points") public points: number[];
    @Input("maxPoints") public maxPoints: number;
    @Input("players") public players: string[];

    public getPointsBarLength(points: number): string {
        let barLengthValue: number = Math.min((points / Math.max(this.maxPoints, 1)) * PERCENTAGE_FACTOR, PERCENTAGE_FACTOR);
        if (barLengthValue < MIN_BAR_LENGTH) {
            barLengthValue = MIN_BAR_LENGTH;
        }

        return "calc(" + barLengthValue + "% - " + POINTS_BAR_BORDER_WIDTH + "px)";
    }
}
