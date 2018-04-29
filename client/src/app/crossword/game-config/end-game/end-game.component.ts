import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { EndGameOptions, GameDifficulty, GameMode } from "../../../../../../common/crossword/constant";
import { GridInformation } from "../../game-info/constants";
import { PlayerID } from "../../services/constants";

const SOLO_END_MESSAGE: string = "Congratulation! You have finished the crossword!";
const LOST_END_MESSAGE: string = "Sorry :( You have lost the game.";
const WIN_END_MESSAGE: string = "Congratulation! You have beaten your opponent and won the game.";
const DRAW_END_MESSAGE: string = "Your battle as been evenly fought! You have the same number of points.";
const SCORE_MESSAGE: string = " The final score is: ";

@Component({
    selector: "app-end-game",
    templateUrl: "./end-game.component.html",
    styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent implements OnInit {
    private _message: string;
    public gridInformation: GridInformation;

    @Input("gridInformation") public set getInformation(value: GridInformation) {
        this.gridInformation = value;
    }

    @Output() public selectedEvent: EventEmitter<EndGameOptions>;

    public constructor() {
        this.gridInformation = {difficulty: GameDifficulty.Easy,
                                maxPoints: 0,
                                mode: GameMode.Solo,
                                players: [],
                                points: [0, 0]};
        this.selectedEvent = new EventEmitter<EndGameOptions>();
        this._message = "";
    }

    public ngOnInit(): void {
        if (this.gridInformation.players.length !== 0) {
            this._message = (this.isDraw()) ?
                                DRAW_END_MESSAGE :
                                (this.isWinner()) ?
                                    WIN_END_MESSAGE :
                                    LOST_END_MESSAGE;
            this._message += SCORE_MESSAGE;
            this._message += this.gridInformation.points[PlayerID.SELF] + " - " + this.gridInformation.points[PlayerID.OPPONENT];
        } else {
            this._message = SOLO_END_MESSAGE;
        }
    }

    public get options(): string[] {
        const options: string[] = [];
        for (const option in EndGameOptions) {
            if (isNaN(Number(option))) {
                options.push(option);
            }
        }

        return options;
    }

    public onSelect(option: EndGameOptions): void {
        this.selectedEvent.emit(option);
    }

    public get message(): string {
        return this._message;
    }

    private isDraw(): boolean {
        return this.gridInformation.points[PlayerID.SELF] === this.gridInformation.points[PlayerID.OPPONENT];
    }

    private isWinner(): boolean {
        return this.gridInformation.points[PlayerID.SELF] > this.gridInformation.points[PlayerID.OPPONENT];
    }

}
