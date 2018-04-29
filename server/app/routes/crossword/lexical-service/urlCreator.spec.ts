import { expect } from "chai";
import "reflect-metadata";
import { URLCreator } from "./urlCreator";

const url: URLCreator = new URLCreator();

const EXPECTED_COMMON_WORD_CONDITION_URL: string =  "http://api.wordnik.com:80/v4/words.json/search/%3Fal%3F%3F"
                                                    + "?caseSensitive=true"
                                                    + "&excludePartOfSpeech=family-name,given-name,proper-noun"
                                                    + "&minCorpusCount=100000"
                                                    + "&maxCorpusCount=-1"
                                                    + "&hasDictionaryDef=true"
                                                    + "&minDictionaryCount=5"
                                                    + "&maxDictionaryCount=-1"
                                                    + "&minLength=5"
                                                    + "&maxLength=5"
                                                    + "&skip=0&limit=10000"
                                                    + "&api_key=63692b64eb718e8fc95230acf5003755bf595f1927015ea1b";

const EXPECTED_UNCOMMON_WORD_CONDITION_URL: string =  "http://api.wordnik.com:80/v4/words.json/search/%3F%3F%3F%3F%3F"
                                                    + "?caseSensitive=true"
                                                    + "&excludePartOfSpeech=family-name,given-name,proper-noun"
                                                    + "&minCorpusCount=5"
                                                    + "&maxCorpusCount=100000"
                                                    + "&hasDictionaryDef=true"
                                                    + "&minDictionaryCount=5"
                                                    + "&maxDictionaryCount=-1"
                                                    + "&minLength=5"
                                                    + "&maxLength=5"
                                                    + "&skip=0&limit=10000"
                                                    + "&api_key=63692b64eb718e8fc95230acf5003755bf595f1927015ea1b";

const EXPECTED_DEFINITION_URL: string = "http://api.wordnik.com:80/v4/word.json/hello/definitions?"
                                        + "limit=10"
                                        + "&sourceDictionaries=all"
                                        + "&useCanonical=false"
                                        + "&includeTags=false"
                                        + "&api_key=63692b64eb718e8fc95230acf5003755bf595f1927015ea1b";

describe("urlCreator", () => {
    describe("getWordsSearchUrl", () => {

        it("word url with condition: should return the url for the search words matching ?al??", () => {
            const theUrl: string = url.getWordsSearchURL("?al??", true);
            expect(theUrl).to.equal(EXPECTED_COMMON_WORD_CONDITION_URL);
        });

        it("word url with no condition and uncommon: should return the url for the search of 5 letter words", () => {
            const theUrl: string = url.getWordsSearchURL("?????", false);
            expect(theUrl).to.equal(EXPECTED_UNCOMMON_WORD_CONDITION_URL);
        });
    });

    describe("getWordDefinitonUrl", () => {

        it("word url no condition: should return the url for definition search", () => {
            expect(url.getDefinitionSearchURL("hello")).to.equal(EXPECTED_DEFINITION_URL);
        });
    });
});
