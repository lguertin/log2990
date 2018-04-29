import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { SOCKET_GET_ALL_ROOMS, SOCKET_DISCONNECTION, SOCKET_JOIN_ROOM, SOCKET_CREATE_ROOM, GridWord, SOCKET_OPPONENT_SELECTED_WORD,
         SOCKET_OPPONENT_VALIDATE_WORD, SOCKET_GET_GRID, SOCKET_ROOM_FILLED, SOCKET_UPDATE_GRID,
         SOCKET_UPDATE_ROOM_LIST,
         SOCKET_REPLAY} from "../../../../../common/crossword/constant";
import { Room } from "../../../../../common/crossword/room";
import { PlayerID } from "./constants";
import { BASE_URL } from "../../constants";

@Injectable()
export class SocketsService {
    private rooms: Room[];
    private socket: SocketIOClient.Socket;
    private words: GridWord[];
    private joinedRoom: Room;

    public constructor() {
        this.rooms = [];
        this.words = [];
        this.joinedRoom = new Room();
    }

    public connectToServer(): void {
        this.socket = io.connect(BASE_URL);
    }

    public createRoom(room: Room): void {
        room.players[PlayerID.SELF].id = this.socket.id;
        this.socket.emit(SOCKET_CREATE_ROOM, room);
    }

    public connectToRoom(room: Room): void {
        room.opponent.id = this.socket.id;
        this.socket.emit(SOCKET_JOIN_ROOM, room);
    }

    public disconnectFromServer(): void {
        this.socket.disconnect();
    }

    public startPlaying(): Observable<void> {
        return new Observable<void> ((observer) => {
            this.socket.once(SOCKET_ROOM_FILLED, (room: Room) => {
                this.joinedRoom = room;
                observer.next();
            });
        });
    }

    public get allRooms(): Observable<Room[]> {
        this.socket.emit(SOCKET_GET_ALL_ROOMS);

        return new Observable<Room[]> ((observer) => {
            this.socket.once(SOCKET_GET_ALL_ROOMS, (rooms: Room[]) => {
                const roomsDuplicate: Room[] = Room.copyList(rooms);
                observer.next(this.rooms = roomsDuplicate);
            });
        });
    }

    public updateRoomList(): Observable<Room[]> {
        return new Observable<Room[]> ((observer) => {
            this.socket.on(SOCKET_UPDATE_ROOM_LIST, (rooms: Room[]) => {
                const roomsDuplicate: Room[] = Room.copyList(rooms);
                observer.next(this.rooms = roomsDuplicate);
            });
        });
    }

    public listenOppenentDisconnection(): Observable<void> {
        return new Observable<void> ( (observer) => {
            this.socket.on(SOCKET_DISCONNECTION, () => {
                this.socket.disconnect();
                observer.next();
            });
        });
    }

    public getGrid(): Observable<GridWord[]> {
        this.socket.emit(SOCKET_GET_GRID);

        return new Observable((observer) => {
            this.socket.once(SOCKET_GET_GRID, (words: GridWord[]) => {
                observer.next(this.words = words);
            });
        });
    }

    public updateGrid(words: GridWord[]): void {
        this.words = words;
        this.socket.emit(SOCKET_UPDATE_GRID, words);
    }

    public sendSelectedWord(gridWord: GridWord): void {
        this.socket.emit(SOCKET_OPPONENT_SELECTED_WORD, gridWord);
    }

    public sendValidatedWord(gridWord: GridWord): void {
        this.socket.emit(SOCKET_OPPONENT_VALIDATE_WORD, gridWord);
    }

    public receiveValidateWord(): Observable<GridWord> {
        return new Observable<GridWord> ( (observer) => {
            this.socket.on(SOCKET_OPPONENT_VALIDATE_WORD, (gridWord: GridWord) => observer.next(gridWord));
        });
    }

    public receiveSelectedWord(): Observable<GridWord> {
        return new Observable<GridWord> ( (observer) => {
            this.socket.on(SOCKET_OPPONENT_SELECTED_WORD, (gridWord: GridWord) => observer.next(gridWord));
        });
    }

    public sendReplay(isReplaying: boolean): void {
        this.socket.emit(SOCKET_REPLAY, isReplaying);
    }

    public receiveReplay(): Observable<boolean> {
        return new Observable<boolean> ( (observer) => {
            this.socket.on(SOCKET_REPLAY, (isReplaying: boolean) => observer.next(isReplaying));
        });
    }

    public receiveGridUpdate(): Observable<void> {
        return new Observable<void> ( (observer) => {
            this.socket.on(SOCKET_UPDATE_GRID, () => observer.next());
        });
    }

    public get playerNames(): string[] {
        const orderedNames: string[] = [];
        for (const player of this.joinedRoom.players) {
            orderedNames[(player.id === this.socket.id) ? 0 : 1] = player.name;
        }

        return orderedNames;
    }
}
