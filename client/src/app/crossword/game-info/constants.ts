import { GameDifficulty, GameMode } from "../../../../../common/crossword/constant";

export interface GridInformation {
    difficulty: GameDifficulty;
    mode: GameMode;
    points: number[];
    maxPoints: number;
    players: string[];
}
