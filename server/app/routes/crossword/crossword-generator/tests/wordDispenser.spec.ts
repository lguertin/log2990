import { expect } from "chai";
import { WordDispenser } from "../wordDispenser";
import { GameDifficulty } from "../../../../../../common/crossword/constant";

const MAX_TIME_FOR_CACHE: number = 20;

/* tslint:disable: no-magic-numbers */
describe("Testing word dispenser", () => {
    const wordDispenser: WordDispenser = new WordDispenser(GameDifficulty.Medium);

    describe("getWord() from lexical service", () => {
        it("Should return a three letter word retrieved directly from the lexical service", () => {
            expect(wordDispenser.getWord("%3F%3F%3F").length).to.equal(3);
        });
    });

    before( () => {
        wordDispenser.getWord("%3F%3F%3F%3F");
    });
    describe("getWord() from lexical service", () => {
        it("Should return a three four word retrieved from cache if similar call was made before", (done: MochaDone) => {
            expect(wordDispenser.getWord("%3F%3F%3F%3F").length).to.equal(4);
            done();
        }).timeout(MAX_TIME_FOR_CACHE);
    });
});
