import { GridWord, DiscoveryState } from "../../../../../common/crossword/constant";

export interface Hint {
    gridWord: GridWord;
    discoveryState: DiscoveryState;
    isSelected: boolean;
}
