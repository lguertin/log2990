import { Component, Input } from "@angular/core";
import { TrackManagerService } from "../../admin-dashboard/track-manager.service";
import { TrackInformation, PlayerBestTime } from "../../../../../../common/racing/constants";
import { Player } from "../../player/player";
import { LOCAL_PLAYER_NAME } from "../../player/constants";

const MAXIMUM_HIGHSCORE_LENGTH: number = 5;
const ANONYMOUS_NAME: string = "Anonymous";

@Component({
    selector: "app-highscores",
    templateUrl: "./highscores.component.html",
    styleUrls: ["./highscores.component.css"]
})
export class HighscoresComponent {
    @Input("racePlayers") public set racePlayers(value: Player[]) {
        this._players = value;
    }
    @Input("trackInformation") public set TrackInformation(value: TrackInformation) {
        this._trackInformation = value;
    }

    private _trackInformation: TrackInformation;
    private _players: Player[];
    public localPlayerName: string;
    private _isHighscoreNameSaved: boolean;

    public constructor(private trackManager: TrackManagerService) {
        this._trackInformation = new TrackInformation();
        this._players = [];
        this.localPlayerName = ANONYMOUS_NAME;
        this._isHighscoreNameSaved = false;
    }

    private get localBestPlayer(): Player {
        return this._players[0];
    }

    public isQualifiedForHighscore(): boolean {
        return this.localBestPlayer.name === LOCAL_PLAYER_NAME && this.isInHighscores();
    }

    public save(): void {
        this.addPlayerToHighscores();
        this.sortHighscores();
        this.popSlowestHighscore();
        this.trackManager.update(this._trackInformation).subscribe();
        this._isHighscoreNameSaved = true;
    }

    public reloadPage(): void {
        location.reload();
    }

    public get trackInformation(): TrackInformation {
        return this._trackInformation;
    }

    public get players(): Player[] {
        return this._players;
    }

    public get isHighscoreNameSaved(): boolean {
        return this._isHighscoreNameSaved;
    }

    private localPlayerWonRace(): boolean {
        for (const playerTime of this._trackInformation.bestTimes) {
            if (this.localBestPlayer.statistics.finalTime < playerTime.time) {
                return true;
            }
        }

        return false;
    }

    private someSpaceLeftInHighScores(): boolean {
        return this._trackInformation.bestTimes.length < MAXIMUM_HIGHSCORE_LENGTH;
    }

    public isInHighscores(): boolean {
        return this.localPlayerWonRace() || this.someSpaceLeftInHighScores();
    }

    private sortHighscores(): void {
        this._trackInformation.bestTimes.sort(
            (time1: PlayerBestTime, time2: PlayerBestTime) => time1.time - time2.time
        );
    }

    private popSlowestHighscore(): void {
        if (this._trackInformation.bestTimes.length > MAXIMUM_HIGHSCORE_LENGTH) {
            this._trackInformation.bestTimes.pop();
        }
    }

    private get localPlayerBestTime(): PlayerBestTime {
        return {
            name: this.localPlayerName,
            time: this.localBestPlayer.statistics.finalTime
        };
    }

    private addPlayerToHighscores(): void {
        this._trackInformation.bestTimes.push(this.localPlayerBestTime);
    }
}
