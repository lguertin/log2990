import { WordNikWordSearch, WordNikDefinition } from "./wordNikApiConstants";
import { URLCreator } from "./urlCreator";
import { DataFetcher } from "./dataFetcher";
import { injectable } from "inversify";

@injectable()
export class WordFetcher {
    private urlCreator: URLCreator;

    constructor() {
        this.urlCreator = new URLCreator();
    }

    public async getWords(wordConstraint: string, isCommon: boolean): Promise<string[]> {
        const url: string = this.urlCreator.getWordsSearchURL(wordConstraint, isCommon);

        return this.getWordList(url);
    }

    private async getWordList(wordSeachUrl: string): Promise<string[]> {
        const data: string = await DataFetcher.getApiData(wordSeachUrl);

        return this.parseWordsData(data);
    }

    public async getWordDefinitions(word: string): Promise<string[]> {
        const definitionUrl: string = this.urlCreator.getDefinitionSearchURL(word);
        const definitionsData: string = await DataFetcher.getApiData(definitionUrl);

        return this.parseDefinitionsData(definitionsData);
    }

    private parseWordsData(data: string): string[] {
        const words: string[] = new Array();
        const wordsData: WordNikWordSearch = JSON.parse(data);

        if (wordsData.totalResults > 0) {
            for (const wordData of wordsData.searchResults) {
                words.push(wordData.word);
            }
        }

        return words;
    }

    private parseDefinitionsData(data: string): string[] {
        const definitions: string[] = new Array();

        if (data !== "") {
            const definitionsData: WordNikDefinition[] = JSON.parse(data);
            for (const definitionData of definitionsData) {
                definitions.push(definitionData.text);
            }
        }

        return definitions;
    }
}
