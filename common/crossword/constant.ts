export enum GameDifficulty {
    Easy,
    Medium,
    Hard
}

export enum DiscoveryState {
    NonDiscovered,
    DiscoveredSelf,
    DiscoveredOpponent,
    DiscoveredBoth
}

export const BLACK_CELL: string = "*";
export const EMPTY_CELL: string = " ";
export const enum Direction {
    VERTICAL,
    HORIZONTAL
}
export const GRID_DIMENTION: number = 10;

export enum GameMode {
    Solo = "Solo",
    Multiplayer = "Multiplayer"
}

export enum EndGameOptions {
    Replay = "Replay",
    Menu = "Menu"
}

export const GRID_DIMENSION: number = 10;


export interface GridWord {
    posI: number;
    posJ: number;
    direction: Direction;
    word: string;
    definition: string;
}

export interface Player {
    id: string;
    name: string;
    score: number;
}

export const SOCKET_CONNECTION: string = "connection";
export const SOCKET_DISCONNECT: string = "disconnect";
export const SOCKET_CREATE_ROOM: string = "create-room";
export const SOCKET_JOIN_ROOM: string = "join-room";
export const SOCKET_ROOM_FILLED: string = "room-filled";
export const SOCKET_GET_ALL_ROOMS: string = "get-all-rooms";
export const SOCKET_UPDATE_ROOM_LIST: string = "update-room-list";
export const SOCKET_GET_GRID: string = "get-grid";
export const SOCKET_UPDATE_GRID: string = "update-grid";
export const SOCKET_DISCONNECTION: string = "host-disconnection";
export const SOCKET_OPPONENT_SELECTED_WORD: string = "player-selected-word";
export const SOCKET_OPPONENT_VALIDATE_WORD: string = "player-validate-word";
export const SOCKET_REPLAY = "replay";
