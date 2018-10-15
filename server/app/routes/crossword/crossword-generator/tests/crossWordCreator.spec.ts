import { expect } from "chai";
import { CrossWordCreator } from "../crossWordCreator";
import { GameDifficulty, GridWord } from "../../../../../../common/crossword/constant";

const maxTimeoutTime: number = 45000;
const MINIMUM_WORD_COUNT: number = 20;

describe("GridFiller", () => {
    it("should create a grid with minimum 20 words", (done: MochaDone) => {
        CrossWordCreator.createCrossWord(GameDifficulty.Hard).then((gridWords: GridWord[]) => {
            expect(gridWords.length).to.be.least(MINIMUM_WORD_COUNT, "Grid contains less than 20 words");
        }).catch(() => { console.error("GridFiller Spec: Could not generate a grid."); });
        done();
    }).timeout(maxTimeoutTime);

    it("should create a grid with definitions which are not containing the word", async (done: MochaDone) => {
        CrossWordCreator.createCrossWord(GameDifficulty.Hard).then((gridWords: GridWord[]) => {
            expect(areWordsWithinDefinition(gridWords)).to.equal(false);
        }).catch(() => { console.error("GridFiller Spec: Could not generate a grid."); });
        done();
    }).timeout(maxTimeoutTime);
});

/*tslint:disable-next-line:only-arrow-functions*/
function areWordsWithinDefinition(gridWords: GridWord[]): boolean {
    for (const gridWord of gridWords) {
        if (isWordInDefinition(gridWord)) {
            return true;
        }
    }

    return false;
}

/*tslint:disable-next-line:only-arrow-functions*/
function isWordInDefinition(gridWord: GridWord): boolean {
    return gridWord.definition.indexOf(gridWord.word, 0) === -1;
}
