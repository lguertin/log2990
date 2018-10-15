import { Direction } from "../../../../../common/crossword/constant";
import { Word } from "./types/word";

export const LEXICON_WORD_URL: string = "http://localhost:3000/crossword/lexicon/word/";
export const LEXICON_WORDS_URL: string = "http://localhost:3000/crossword/lexicon/words/";
export const LEXICON_DEFINITION: string = "http://localhost:3000/crossword/lexicon/definition/";
export interface WordSlot {
    readonly posI: number;
    readonly posJ: number;
    readonly direction: Direction;
    readonly length: number;
    word: Word;
}

export const INTEROGATION_MARK: string = "%3F";

export const MINIMUM_WORD_LENGTH: number = 2;
export const HORIZONTAL_PROBABILITY: number = 7;
export const VERTICAL_PROBABILITY: number = 6;

export enum WordRarity {
    Common,
    Uncommon,
}
