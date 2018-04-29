import { Player, GameDifficulty, GridWord } from "./constant";

const MAX_PLAYERS = 2;

export interface IRoom {
    players: Player[];
    difficulty: GameDifficulty;
    grid: GridWord[];
}

export class Room {
    public players: Player[];
    public difficulty: GameDifficulty;
    public gridWords: GridWord[];

    constructor(room?: IRoom) {
        if (!room) {
            this.players = [];
            this.difficulty = GameDifficulty.Easy;
            this.gridWords = [];
        } else {
            this.players = room.players;
            this.difficulty = room.difficulty;
            this.gridWords = room.grid;
        }
    }

    public get host(): Player {
        return this.players[0];
    }

    public get opponent(): Player {
        return this.players[1];
    }

    public set opponent(player: Player) {
        this.players[1] = player;
    }

    public addPlayer(player: Player) {
        if (this.players.length < MAX_PLAYERS) {
            this.players.push(player);
        }
    }

    public isFull(): boolean {
        return this.players.length === MAX_PLAYERS;
    }

    public static copy(room: Room): Room {
        return new Room({players: room.players, difficulty: room.difficulty, grid: room.gridWords});
    }

    public static copyList(rooms: Room[]): Room[] {
        const roomsDuplicate: Room[] = [];
        for (const room of rooms) {
            roomsDuplicate.push(Room.copy(room));
        }

        return roomsDuplicate;
    }
}