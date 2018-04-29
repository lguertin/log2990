import { expect } from "chai";
import { Word } from "./word";

const wordToTests: string[] = ["ma-tu-vu", "ésperluette", "chocolate", ";;;;", "e-mail"];
const wordExpected: string[] = ["matuvu", "esperluette", "chololate", "", "email"];

describe("Word", () => {
    for (let i: number = 0; i < wordToTests.length; i++) {
        describe("Testing if '" + wordToTests[i] + "' if correctly parsed", () => {
            it("should return " + wordExpected[i], () => {
                const newWord: Word = new Word(wordExpected[i]);
                expect(newWord.getWord(), wordExpected[i]);
            });
        });
    }
});
