import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GameDifficulty, Player } from "../../../../../../common/crossword/constant";
import { Room } from "../../../../../../common/crossword/room";
import { SocketsService } from "../../services/sockets.service";
import { Subscription } from "rxjs/Subscription";

export const VALID_USERNAME_CLASS: string = "valid-username";
export const INVALID_USERNAME_CLASS: string = "invalid-username";

@Component({
    selector: "app-multiplayer-rooms",
    templateUrl: "./multiplayer-rooms.component.html",
    styleUrls: ["./multiplayer-rooms.component.css"]
})
export class MultiplayerRoomsComponent implements OnInit {
    @Output() public multiplayerRoom: EventEmitter<Room>;

    private _rooms: Room[];
    private _isShowingDifficultySelector: boolean;
    private _inputBox: string;
    private username: string;
    private chosenRoom: Room;
    private roomListSubscription: Subscription;

    public constructor(private socketsService: SocketsService) {
        this.multiplayerRoom = new EventEmitter<Room>();
        this._rooms = [];
        this.username = "";
        this._isShowingDifficultySelector = false;
        this.chosenRoom = new Room();
        this._inputBox = INVALID_USERNAME_CLASS;
    }

    public ngOnInit(): void {
        const initialisationSubscription: Subscription = this.socketsService.allRooms.subscribe((rooms: Room[]) => {
            this._rooms = rooms;
            initialisationSubscription.unsubscribe();
        });

        this.roomListSubscription = this.socketsService.updateRoomList().subscribe((rooms: Room[]) => {
            this._rooms = rooms;
        });
    }

    public createRoom(username: string): void {
        if (this.isValidUsername(username)) {
            this._isShowingDifficultySelector = true;
            this.username = username;
        }
    }

    public onDifficultySelected(difficulty: GameDifficulty): void {

        this.onDifficultySelectedLocalChange(difficulty);
        this.socketsService.createRoom(this.chosenRoom);
        this.multiplayerRoom.emit(this.chosenRoom);
        this.roomListSubscription.unsubscribe();
    }

    public onDifficultySelectedLocalChange(difficulty: GameDifficulty): void {
        this._isShowingDifficultySelector = false;
        this.addNewPlayerToRoom();
        this.chosenRoom.difficulty = difficulty;
    }

    public onSelectRoom(room: Room, username: string): void {
        this.username = username;
        if (this.isValidUsername(username)) {
            this.chosenRoom = room;
            this.addNewPlayerToRoom();
            this.socketsService.connectToRoom(this.chosenRoom);
            this.multiplayerRoom.emit(this.chosenRoom);
            this.roomListSubscription.unsubscribe();
        }
    }

    public isRoomAvailable(room: Room): boolean {
        return !room.isFull() && room.gridWords.length > 0;
    }

    public classInputBox(username: string): void {
        this._inputBox = this.isValidUsername(username) ? VALID_USERNAME_CLASS : INVALID_USERNAME_CLASS;
    }

    public get isShowingDifficultySelector(): boolean {
        return this._isShowingDifficultySelector;
    }

    public get rooms(): Room[] {
        return this._rooms;
    }

    public get inputBox(): string {
        return this._inputBox;
    }

    private isValidUsername(username: string): boolean {
        return username !== "" && this.isUsernameAvailable(username);
    }

    private isUsernameAvailable(username: string): boolean {
        for (const room of this._rooms) {
            if (room.host.name === this.username) {
                return false;
            }
        }

        return true;
    }

    private addNewPlayerToRoom(): void {
        const player: Player = { id: "", name: this.username, score: 0 };
        this.chosenRoom.players.push(player);
    }
}
