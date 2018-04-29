import { expect } from "chai";

import "reflect-metadata";
import { WordFetcher } from "./wordFetcher";

const wordGen: WordFetcher = new WordFetcher();
const WORD_LENGTH_3: number = 3;
const WORD_LENGTH_5: number = 5;

describe("Word Fetcher", () => {
    describe("getWords", () => {

        it("Invalid word (asdasfa) : should return empty array from both common and uncommon calls", () => {
            wordGen.getWords("asdasfa", true).then((words: string[]) => {
                expect(words).to.equal([]);
            }).catch(() => {
                console.error("Unable to get word promise");
            });

            wordGen.getWords("asdasfa", false).then((words: string[]) => {
                expect(words).to.equal([]);
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Common word (house) : should return array with only 1 word (house)", () => {
            wordGen.getWords("house", true).then((words: string[]) => {
                expect(words[0]).to.equal("house");
                expect(words.length).to.equal(1);
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Uncommon word (house) : should return empty string array because house is common", () => {
            wordGen.getWords("house", false).then((words: string[]) => {
                expect(words).to.equal([]);
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Random word (???) : should return an array of common 3 letter words from both common and uncommon calls", () => {
            wordGen.getWords("???", true).then((commonWords: string[]) => {
                for (const word of commonWords) {
                    expect(word.length).to.equal(WORD_LENGTH_3);
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });

            wordGen.getWords("???", false).then((uncommonWords: string[]) => {
                for (const word of uncommonWords) {
                    expect(word.length).to.equal(WORD_LENGTH_3);
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Random word (?????) : should return an array of common 5 letter words from both common and uncommon calls", () => {
            wordGen.getWords("?????", true).then((commonWords: string[]) => {
                for (const word of commonWords) {
                    expect(word.length).to.equal(WORD_LENGTH_5);
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });

            wordGen.getWords("?????", false).then((uncommonWords: string[]) => {
                for (const word of uncommonWords) {
                    expect(word.length).to.equal(WORD_LENGTH_5);
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Common word (a???) : should return an array of common 5 letter words starting with a", () => {
            wordGen.getWords("a????", true).then((words: string[]) => {
                for (const word of words) {
                    expect(word.length).to.equal(WORD_LENGTH_5);
                    expect(word[0]).to.equal("a");
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });

        it("Uncommon word (a???) : should return an uncommon 5 letter word starting with a", () => {
            wordGen.getWords("a????", false).then((words: string[]) => {
                for (const word of words) {
                    expect(word.length).to.equal(WORD_LENGTH_5);
                    expect(word[0]).to.equal("a");
                }
            }).catch(() => {
                console.error("Unable to get word promise");
            });
        });
    });

    describe("getWordDefinition", () => {

        it('Definitions of "Hello" : should return definitions of hello', () => {
            wordGen.getWordDefinitions("hello").then((definitions: string[]) => {
                expect(definitions[0]).to.equal("Used to greet someone, answer the telephone, or express surprise.");
                expect(definitions[1]).to.equal('A calling or greeting of "hello.”');
            }).catch(() => {
                console.error("Unable to get definitions promise");
            });
        });

        it('Definitions of "House" : should return definitions of house', () => {
            wordGen.getWordDefinitions("house").then((definitions: string[]) => {
                expect(definitions[0]).to.equal("A structure serving as a dwelling for one or more persons, especially for a family.");
                expect(definitions[1]).to.equal("A household or family.");
            }).catch(() => {
                console.error("Unable to get definitions promise");
            });
        });

        it('Definitions of "ytregfdtr" : should return no definitions because word does not exist', () => {
            wordGen.getWordDefinitions("ytregfdtr").then((definitions: string[]) => {
                expect(definitions.length).to.equal(0);
            }).catch(() => {
                console.error("Unable to get definitions promise");
            });
        });
    });
});
