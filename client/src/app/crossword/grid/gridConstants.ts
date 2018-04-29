import { GridWord } from "../../../../../common/crossword/constant";
import { PlayerID } from "../services/constants";

export const GRID_DIVISION: number = 10;
export const MAX_PERCENTAGE: number = 100;
export const FILLED_CELL_SYMBOL: string = "*";
export const EMPTY_INPUT: string = "";
export const KEY_BACKSPACE: string = "Backspace";
export const KEY_TAB: string = "Tab";

export const CELL_TYPE_FILLED: string = "filled";
export const CELL_TYPE_EMPTY: string = "empty";
export const CELL_TYPE_SELECTED_CURRENT: string = "selectedCurrent";
export const CELL_TYPE_SELECTED: string = "selectedCell";
export const CELL_TYPE_NON_SELECTED: string = "nonSelectedCell";
export const CELL_TYPE_MULTIPLAYER_SELECTED_BOTH_CURRENT: string = "multiplayerCurrentOurCell";
export const CELL_TYPE_MULTIPLAYER_SELECTED_CURRENT: string = "multiplayerCurrentCell";
export const CELL_TYPE_MULTIPLAYER_SELECTED_BOTH: string = "multiplayerOurCell";
export const CELL_TYPE_MULTIPLAYER_SELECTED_SELF: string = "multiplayerMyCell";
export const CELL_TYPE_MULTIPLAYER_SELECTED_OPPONENT: string = "multiplayerHisCell";
export const CELL_TYPE_DISCOVERED_SELF: string = "myDiscoveredCell";
export const CELL_TYPE_DISCOVERED_OPPONENT: string = "hisDiscoveredCell";
export const CELL_TYPE_DISCOVERED_BOTH: string = "ourDiscoveredCell";

export interface WordValidation {
    word: GridWord;
    player: PlayerID;
}
