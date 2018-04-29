import { DiscoveryState } from "../../../../../common/crossword/constant";

export interface Cell {
    i: number;
    j: number;
    letter: string;
    discoveryState: DiscoveryState;
    input: string;
}
