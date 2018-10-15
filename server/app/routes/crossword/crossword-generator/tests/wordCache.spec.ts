import { expect } from "chai";
import {WordCache} from "../wordCache";

describe("Testing word cache", () => {
    const wordCacheToBeTested: WordCache = new WordCache();
    const searchesWords: string[] = ["?????", "??"];
    const searchesResponseOne: string[] = ["hello", "shine"];
    const searchesResponseTwo: string[] = ["hi", "PC"];
    wordCacheToBeTested.pushSearch(searchesWords[0], searchesResponseOne);
    wordCacheToBeTested.pushSearch(searchesWords[1], searchesResponseTwo);
    describe("Testing if the method constainsSearch Works", () => {

        it("Should return false if the search n?? doesn't exist in the cache", () => {
            expect(wordCacheToBeTested.containsSearch("n??")).to.equal(false);
        });

        it("Should Return true if the search ?? exists in the cache", () => {
            expect(wordCacheToBeTested.containsSearch("??")).to.equal(true);
        });
    });

    describe("Testing if popping random words works with ??", () => {
        it("should return a 2 letter word and the cache for that search should contain 1 less element", () => {
            const nWordsBefore: number = wordCacheToBeTested.getSearch(searchesWords[1]).length;
            const response: string = wordCacheToBeTested.popRandomWord(searchesWords[1]);
            const nWordsAfter: number = wordCacheToBeTested.getSearch(searchesWords[1]).length;
            expect(response.length).to.be.equal(searchesWords[1].length);
            expect(nWordsBefore).to.be.equal(nWordsAfter + 1);
        });

        it("should return empty string because the word vscode is not in the cache", () => {
            expect(wordCacheToBeTested.popRandomWord("vscode")).to.equal("");
        });
    });
});
