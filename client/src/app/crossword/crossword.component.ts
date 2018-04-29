import { Component } from "@angular/core";
import { GameDifficulty, GameMode, GridWord, EndGameOptions } from "../../../../common/crossword/constant";
import { GridService } from "./services/grid.service";
import { SocketsService } from "./services/sockets.service";
import { Room } from "../../../../common/crossword/room";
import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";
import { WordSelectionService } from "./services/word-selection.service";
import { GridInformation } from "./game-info/constants";
import { PlayerID } from "./services/constants";

const MAX_POINTS: number = 20;

enum CrosswordState {
    GameModeSelector,
    DifficultySelector,
    MultiplayerRooms,
    WaitingRoom,
    Game,
    End
}

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"],
    providers: [SocketsService,
                WordSelectionService]
})

export class CrosswordComponent {

    public gameModeType: typeof GameMode = GameMode;
    public crosswordStateType: typeof CrosswordState = CrosswordState;

    public words: GridWord[];
    public state: CrosswordState;
    private gridInformation: GridInformation;
    private hadOpponentClickReplay: boolean;
    private hadSelfClickReplay: boolean;
    private gridHasUpdated: boolean;

    public constructor(private gridService: GridService, private socketsService: SocketsService, private router: Router) {
        this.words = [];
        this.state = CrosswordState.GameModeSelector;
        this.gridInformation = {
            difficulty: GameDifficulty.Easy,
            mode: GameMode.Solo,
            points: [0, 0],
            maxPoints: MAX_POINTS,
            players: []
        };
        this.hadOpponentClickReplay = false;
        this.hadSelfClickReplay = false;
        this.gridHasUpdated = false;
    }

    public onDifficultySelected(difficulty: GameDifficulty): void {
        this.gridInformation.difficulty = difficulty;
        this.getGrid(this.gridInformation.difficulty);
        this.state = CrosswordState.Game;
    }

    public onGameModeSelected(mode: GameMode): void {
        this.gridInformation.mode = mode;
        if (this.gridInformation.mode === GameMode.Multiplayer) {
            this.state = CrosswordState.MultiplayerRooms;
            this.socketsService.connectToServer();
        } else {
            this.state = CrosswordState.DifficultySelector;
        }
    }

    public onRoomSelectionFinish(room: Room): void {
        this.startPlayingSubscription();
        this.gridInformation.difficulty = room.difficulty;
        if (!room.isFull()) {
            this.getGrid(room.difficulty);
            this.state = CrosswordState.WaitingRoom;
        } else {
            this.subscribeToGrid();
        }
    }

    public get difficulty(): GameDifficulty {
        return this.gridInformation.difficulty;
    }

    public get mode(): GameMode {
        return this.gridInformation.mode;
    }

    public get points(): number[] {
        return this.gridInformation.points;
    }

    public get players(): string[] {
        return this.gridInformation.players;
    }

    public get maxPoints(): number {
        return this.gridInformation.maxPoints;
    }

    public getGrid(difficulty: GameDifficulty): void {
        const subscription: Subscription = this.gridService.getGrid(difficulty)
            .subscribe((words: GridWord[]): void => {
                this.words = words;
                this.gridInformation.maxPoints = this.words.length;
                if (this.gridInformation.mode === GameMode.Multiplayer) {
                    this.socketsService.updateGrid(this.words);
                }
                subscription.unsubscribe();
            });
    }

    public playerOneScoreIncrement(): void {
        this.incrementScorePlayerOne();
        this.checkGameCompletion();
    }

    public playerTwoScoreIncrement(): void {
        this.incrementScorePlayerTwo();
        this.checkGameCompletion();
    }

    public onEndSelection(selectedOption: EndGameOptions): void {
        if ( selectedOption === EndGameOptions.Replay) {
            this.replaySelection();
        } else {
            if (this.gridInformation.mode === GameMode.Multiplayer) {
                this.socketsService.disconnectFromServer();
            }
            this.router.navigateByUrl("/");
        }
    }

    private replaySelection(): void {
        if (this.gridInformation.mode === GameMode.Multiplayer) {
            this.multiplayerReplay();
        } else {
            this.getGrid(this.gridInformation.difficulty);
            this.initializePlayersPoints();
            this.state = CrosswordState.Game;
        }
    }

    private startPlayingSubscription(): void {
        this.socketsService.startPlaying().subscribe(() => {
            this.state = CrosswordState.Game;
            this.gridInformation.players = this.socketsService.playerNames;
            this.socketsServiceSubscriptions();
        });
    }

    private socketsServiceSubscriptions(): void {
        this.socketsService.receiveReplay().subscribe((isReplaying: boolean) => {
            this.hadOpponentClickReplay = isReplaying;
            if (this.hadSelfClickReplay) {
                this.state = CrosswordState.Game;
            }
        });
        this.socketsService.receiveGridUpdate().subscribe(() => {
           this.gridHasUpdated = true;
        });
        this.socketsService.listenOppenentDisconnection().subscribe(() => {
            this.socketsService.disconnectFromServer();
            this.router.navigateByUrl("/");
        });
    }

    private subscribeToGrid(): void {
        this.socketsService.getGrid().subscribe((words: GridWord[]) => this.words = words);
    }

    private incrementScorePlayerOne(): void {
        this.gridInformation.points[PlayerID.SELF]++;
    }

    private incrementScorePlayerTwo(): void {
        this.gridInformation.points[PlayerID.OPPONENT]++;
    }

    private checkGameCompletion(): void {
        if ((this.gridInformation.points[PlayerID.SELF]
                + this.gridInformation.points[PlayerID.OPPONENT]) >= this.gridInformation.maxPoints) {
            this.state = CrosswordState.End;
            this.resetGrid();
        }
    }

    private multiplayerReplay(): void {
        this.state = CrosswordState.WaitingRoom;
        this.hadSelfClickReplay = true;
        this.socketsService.sendReplay(true);
        this.initializePlayersPoints();
        this.checkOpponentHasReplayed();
    }

    private checkOpponentHasReplayed(): void {
        if (this.hadOpponentClickReplay) {
            if ( !this.gridHasUpdated ) {
                this.socketsService.receiveGridUpdate().subscribe(() => {
                    this.subscribeToGrid();
                 });
            } else {
                this.subscribeToGrid();
            }
            this.state = CrosswordState.Game;
        } else {
            this.getGrid(this.gridInformation.difficulty);
        }
    }

    private resetGrid(): void {
        this.gridHasUpdated = false;
        this.hadOpponentClickReplay = false;
        this.hadSelfClickReplay = false;
        this.words = [];
    }

    private initializePlayersPoints(): void {
        this.gridInformation.points[PlayerID.SELF] = 0;
        this.gridInformation.points[PlayerID.OPPONENT] = 0;
    }
}
