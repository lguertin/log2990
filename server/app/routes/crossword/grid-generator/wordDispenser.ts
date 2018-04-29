import { WordCache } from "./wordCache";
import { DataFetcher } from "../lexical-service/dataFetcher";
import { LEXICON_WORDS_URL, WordRarity} from "./constant";
import { GameDifficulty } from "../../../../../common/crossword/constant";

export class WordDispenser {
    private cache: WordCache;

    public constructor(private difficulty: GameDifficulty) {
        this.cache = new WordCache();
    }

    private getWordsFromService(wordConstraint: string): string[] {
        let done: boolean = false;
        let newWords: string[];
        DataFetcher.getApiData(LEXICON_WORDS_URL + this.getUrlByDifficulty() + "/" + wordConstraint).then((wordsData: string) => {
            newWords = JSON.parse(wordsData);
            done = true;
        }).catch(() => {
            console.error("Word Dispenser: Could not retreive words from Lexicon");
        });
        require("deasync").loopWhile(() => !done);

        if (newWords !== []) {
            this.cache.pushSearch(wordConstraint, newWords);
        }

        return newWords;
    }

    private getUrlByDifficulty(): string {
        return WordRarity[(this.difficulty === GameDifficulty.Hard) ? 1 : 0].toLowerCase();
    }

    public getWord(wordConstraint: string): string {
        if (!this.cache.containsSearch(wordConstraint)) {
            this.getWordsFromService(wordConstraint);
        }

        return this.cache.popRandomWord(wordConstraint);
    }
}
