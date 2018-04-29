import { expect } from "chai";
import { Grid } from "./grid";
import { GRID_DIMENSION, GameDifficulty, EMPTY_CELL } from "../../../../../common/crossword/constant";
import { WordFiller } from "./wordFiller";
import { BlackCellFiller } from "./blackCellFiller";
import { WordDispenser } from "./wordDispenser";

const grid: Grid = new Grid(GRID_DIMENSION);
const wordFiller: WordFiller = new WordFiller(GameDifficulty.Easy);
const wordDispenser: WordDispenser = new WordDispenser(GameDifficulty.Easy);
const maxTimeoutTime: number = 20000;

BlackCellFiller.execute(grid);
wordFiller.execute(grid);

describe("WordFiller", () => {
    it("should have a letter on every white cell", () => {
        expect(isAllCellsFilled(grid)).to.equal(true);
    });
    it("should be valid words for every line and column", (done: MochaDone) => {
        expect(isValidWords(grid)).to.equal(true);
        done();
    }).timeout(maxTimeoutTime);
});

/* tslint:disable-next-line:only-arrow-functions */
function isAllCellsFilled(aGrid: Grid): boolean {
    for (let i: number = 0; i < aGrid.getDimension(); i++) {
        for (let j: number = 0; j < aGrid.getDimension(); j++) {
            if (aGrid.getCell(i, j).getLetter() === EMPTY_CELL) {
                return false;
            }
        }
    }

    return true;
}

/* tslint:disable-next-line:only-arrow-functions */
function isValidWords(aGrid: Grid): boolean {
    for (const wordSlot of wordFiller.getHistory()) {
        if (!isValidWord(wordSlot.word.getWord())) {
            return false;
        }
    }

    return true;
}

/* tslint:disable-next-line:only-arrow-functions */
function isValidWord(word: string): boolean {
    return wordDispenser.getWord(word) === word;
}
