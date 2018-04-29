import { SOCKET_CONNECTION, SOCKET_GET_ALL_ROOMS, SOCKET_CREATE_ROOM, SOCKET_JOIN_ROOM, SOCKET_DISCONNECT,
         SOCKET_DISCONNECTION, SOCKET_OPPONENT_SELECTED_WORD, GridWord, SOCKET_OPPONENT_VALIDATE_WORD, SOCKET_GET_GRID,
         SOCKET_UPDATE_GRID, SOCKET_ROOM_FILLED, SOCKET_UPDATE_ROOM_LIST, SOCKET_REPLAY} from "../../../../../common/crossword/constant";
import { Room } from "../../../../../common/crossword/room";

export class Sockets {
    private rooms: Room[];

    constructor(private sioServer: SocketIO.Server) {
        this.rooms = [];
        this.connectSocketToServer();
    }

    private connectSocketToServer(): void {
        this.sioServer.on(SOCKET_CONNECTION, (socket: SocketIO.Socket) =>  {
            this.listenRequests(socket);
        });
    }

    private listenRequests(socket: SocketIO.Socket): void {
        this.listenToCreateRoom(socket);
        this.listenToJoinRoom(socket);
        this.listenToClientDisconnect(socket);
        this.listenToGetAllRooms(socket);
        this.listenToClientSelectedWord(socket);
        this.listenToClientValidateWord(socket);
        this.listenToUpdateWords(socket);
        this.listenToGetWords(socket);
        this.listenToReplay(socket);
    }

    private listenToCreateRoom(socket: SocketIO.Socket): void {
        socket.on(SOCKET_CREATE_ROOM, (room: Room) => {
            const roomDuplicate: Room = Room.copy(room);
            socket.join(roomDuplicate.host.name);
            this.rooms.push(roomDuplicate);
            this.sioServer.emit(SOCKET_UPDATE_ROOM_LIST, this.rooms);
        });
    }

    private listenToJoinRoom(socket: SocketIO.Socket): void {
        socket.on(SOCKET_JOIN_ROOM, (room: Room) => {
            const roomDuplicate: Room = Room.copy(room);
            this.rooms[this.findRoomIndex(roomDuplicate)] = roomDuplicate;
            socket.join(roomDuplicate.host.name);
            this.sioServer.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_ROOM_FILLED, roomDuplicate);
            this.sioServer.emit(SOCKET_UPDATE_ROOM_LIST, this.rooms);
        });
    }

    private listenToGetAllRooms(socket: SocketIO.Socket): void {
        socket.on(SOCKET_GET_ALL_ROOMS, () => {
            socket.emit(SOCKET_GET_ALL_ROOMS, this.rooms);
        });
    }

    private listenToClientDisconnect(socket: SocketIO.Socket): void {
        socket.on(SOCKET_DISCONNECT, () => {
            if (this.findPlayerRoom(socket)) {
                socket.broadcast.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_DISCONNECTION);
                this.rooms.splice(this.findPlayerRoomIndex(socket), 1);
                this.sioServer.emit(SOCKET_UPDATE_ROOM_LIST, this.rooms);
            }
        });
    }

    private listenToClientSelectedWord(socket: SocketIO.Socket): void {
        socket.on(SOCKET_OPPONENT_SELECTED_WORD, (gridWord: GridWord) => {
            socket.broadcast.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_OPPONENT_SELECTED_WORD, gridWord);
        });
    }

    private listenToClientValidateWord(socket: SocketIO.Socket): void {
        socket.on(SOCKET_OPPONENT_VALIDATE_WORD, (gridWord: GridWord) => {
            socket.broadcast.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_OPPONENT_VALIDATE_WORD, gridWord);
        });
    }

    private listenToUpdateWords(socket: SocketIO.Socket): void {
        socket.on(SOCKET_UPDATE_GRID, (words: GridWord[]) => {
            this.rooms[this.findPlayerRoomIndex(socket)].gridWords = words;
            this.sioServer.emit(SOCKET_UPDATE_ROOM_LIST, this.rooms);
            socket.broadcast.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_UPDATE_GRID);
        });
    }

    private listenToGetWords(socket: SocketIO.Socket): void {
        socket.on(SOCKET_GET_GRID, () => {
            socket.emit(SOCKET_GET_GRID, this.rooms[this.findPlayerRoomIndex(socket)].gridWords);
        });
    }

    private listenToReplay(socket: SocketIO.Socket): void {
        socket.on( SOCKET_REPLAY, (isReplaying: boolean) => {
            socket.broadcast.to(this.findPlayerRoom(socket).host.name).emit(SOCKET_REPLAY, isReplaying);
        });
    }

    private findPlayerRoom(socket: SocketIO.Socket): Room {
        for (const room of this.rooms) {
            if (room.host.id === socket.client.id || (room.opponent && room.opponent.id === socket.client.id)) {
                return room;
            }
        }

        return undefined;
    }

    private findPlayerRoomIndex(socket: SocketIO.Socket): number {
        for (let i: number = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].host.id === socket.client.id || (this.rooms[i].opponent && this.rooms[i].opponent.id === socket.client.id)) {
                return i;
            }
        }

        return -1;
    }

    private findRoomIndex(room: Room): number {
        for (let i: number = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].host.id === room.host.id) {
                return i;
            }
        }

        return -1;
    }
}
