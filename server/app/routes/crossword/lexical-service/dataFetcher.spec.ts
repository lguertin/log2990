import { expect } from "chai";
import "reflect-metadata";
import { DataFetcher } from "./dataFetcher";

const TEST_URL: string = "http://httpbin.org/robots.txt";
const WORD_SEARCH_URL: string = "http://api.wordnik.com/v4/words.json/search/a%3F%3F%3F%3F"
                                + "?caseSensitive=true"
                                + "&minCorpusCount=5"
                                + "&maxCorpusCount=-1"
                                + "&minDictionaryCount=1"
                                + "&maxDictionaryCount=-1"
                                + "&minLength=5&maxLength=5"
                                + "&skip=0"
                                + "&limit=1"
                                + "&api_key=63692b64eb718e8fc95230acf5003755bf595f1927015ea1b";

describe("DataFetcher", () => {
    describe("getApiData", () => {
        it("Getting test text from a server through http request", async () => {
            return DataFetcher.getApiData(TEST_URL).then((data: string) => {
                expect(data).to.equal("User-agent: *\nDisallow: /deny\n");
            });
        });
        it("Getting word search data : should return correct data", async () => {
            return DataFetcher.getApiData(WORD_SEARCH_URL).then((data: string) => {
                expect(data).to.equal('{"totalResults":800,"searchResults":[{"lexicality":0.0,"count":24094156,"word":"about"}]}');
            });
        });

    });
});
