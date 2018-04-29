import * as CONSTANT from "./wordNikApiConstants";

export class URLCreator {

    private getCommonTag(common: boolean): string {
        if (common) {
            return CONSTANT.COMMON_TAG;
        } else {
            return CONSTANT.UNCOMMON_TAG;
        }
    }

    private getLengthTag(length: number): string {
        return CONSTANT.MINLENGTH_TAG + length + "&" + CONSTANT.MAXLENGTH_TAG + length + "&";
    }

    private parseWordConstraint(wordConstraint: string): string {
        let parsedWordConstraint: string = "";
        for (const char of wordConstraint) {
            if (char === "?") {
                parsedWordConstraint += "%3F";
            } else {
                parsedWordConstraint += char;
            }
        }

        return parsedWordConstraint;
    }

    public getWordsSearchURL(wordConstraint: string, isCommon: boolean): string {
        const wordStringURL: string = this.parseWordConstraint(wordConstraint);

        let url: string = CONSTANT.BASE_URL + CONSTANT.WORDS_TAG;
        url +=  CONSTANT.SEARCH_TAG + wordStringURL + CONSTANT.CASESENSITIVE_TAG + CONSTANT.EXCLUDEPARTOFSPEECH_TAG
                + this.getCommonTag(isCommon) + CONSTANT.HASDICTIONARYDEF_TAG
                + CONSTANT.DICTIONARYCOUNT_TAG + this.getLengthTag(wordConstraint.length)
                + CONSTANT.SKIP_TAG + CONSTANT.WORDLIMIT_TAG + CONSTANT.API_KEY;

        return url;
    }

    public getDefinitionSearchURL(word: string): string {
        return CONSTANT.BASE_URL + CONSTANT.WORD_TAG + word + "/" + CONSTANT.DEFINITIONS_TAG + CONSTANT.DEFINITIONLIMIT_TAG +
                /*+ CONSTANT.INCLUDERELATED_TAG + */CONSTANT.SOURCEDICTIONARIES_TAG + CONSTANT.CANONICAL_TAG
                + CONSTANT.INCLUDETAGS_TAG + CONSTANT.API_KEY;
    }

}
