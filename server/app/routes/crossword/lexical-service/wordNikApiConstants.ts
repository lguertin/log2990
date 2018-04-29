export interface WordNikWordSearch {
    totalResults: number;
    searchResults: WordNikWord[];
}

export interface WordNikWord {
    lexicality: number;
    count: number;
    word: string;
}

export interface WordNikDefinition {
    textProns: string;
    sourceDictionary: string;
    exampleUses: string;
    relatedWords: string;
    labels: string;
    citations: string;
    word: string;
    partOfSpeech: string;
    sequence: number;
    attributionText: string;
    attributionUrl: string;
    text: string;
    score: number;
}

export const BASE_URL: string = "http://api.wordnik.com:80/v4/";
export const API_KEY: string = "api_key=63692b64eb718e8fc95230acf5003755bf595f1927015ea1b";

export const WORDS_TAG: string = "words.json/";
export const WORD_TAG: string = "word.json/";

export const SEARCH_TAG: string = "search/";
export const DEFINITIONS_TAG: string = "definitions?";
export const RANDOMWORD_TAG: string = "randomWord?";

export const CASESENSITIVE_TAG: string = "?caseSensitive=true&";
export const HASDICTIONARYDEF_TAG: string = "hasDictionaryDef=true&";
export const DICTIONARYCOUNT_TAG: string = "minDictionaryCount=5&maxDictionaryCount=-1&";
export const EXCLUDEPARTOFSPEECH_TAG: string = "excludePartOfSpeech=family-name,given-name,proper-noun&";

export const MINLENGTH_TAG: string = "minLength=";
export const MAXLENGTH_TAG: string = "maxLength=";

export const COMMON_TAG: string = "minCorpusCount=100000&maxCorpusCount=-1&";
export const UNCOMMON_TAG: string = "minCorpusCount=5&maxCorpusCount=100000&";

export const SKIP_TAG: string = "skip=0&";

export const INCLUDERELATED_TAG: string = "includeRelated=true&";
export const SOURCEDICTIONARIES_TAG: string = "sourceDictionaries=all&";

export const CANONICAL_TAG: string = "useCanonical=false&";
export const INCLUDETAGS_TAG: string = "includeTags=false&";

export const WORDLIMIT_TAG: string = "limit=10000&";
export const DEFINITIONLIMIT_TAG: string = "limit=10&";
