import { Component, Input } from "@angular/core";
import { Player } from "../../player/player";
import { TrackInformation } from "../../../../../../common/racing/constants";
import { TrackManagerService } from "../../admin-dashboard/track-manager.service";

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
    styleUrls: ["./leaderboard.component.css"]
})
export class LeaderboardComponent {
    private _players: Player[];
    private _isShowingHighscores: boolean;

    @Input("racePlayers") public set racePlayers(value: Player[]) {
        this._players = value;
        this.calculateFinalTimes();
        this.sortRacersTimes();
    }

    @Input("trackInformation") public trackInformation: TrackInformation;

    public constructor(private trackManager: TrackManagerService) {
        this._players = [];
        this._isShowingHighscores = false;
    }

    public showHighscores(): void {
        this._isShowingHighscores = true;
        this.incrementNumberOfTimesPlayed();
    }

    public get players(): Player[] {
        return this._players;
    }

    public get isShowingHighscores(): boolean {
        return this._isShowingHighscores;
    }

    private calculateFinalTimes(): void {
        for (const player of this._players) {
            for (const lapTime of player.statistics.lapTimes) {
                player.statistics.finalTime += lapTime;
            }
        }
    }

    private sortRacersTimes(): void {
        this._players.sort((player1: Player, player2: Player) => {
            return player1.statistics.finalTime - player2.statistics.finalTime;
        });
    }

    private incrementNumberOfTimesPlayed(): void {
        this.trackInformation.numberOfTimesPlayed++;
        this.trackManager.update(this.trackInformation).subscribe();
    }
}
