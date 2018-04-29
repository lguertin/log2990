import { Direction, GridWord, DiscoveryState } from "../../../../common/crossword/constant";

export class Word implements GridWord {
    public discoveryState: DiscoveryState;
    public constructor( public word: string,
                        public definition: string,
                        public posI: number,
                        public posJ: number,
                        public direction: Direction) {
        this.discoveryState = DiscoveryState.NonDiscovered;
    }

}
