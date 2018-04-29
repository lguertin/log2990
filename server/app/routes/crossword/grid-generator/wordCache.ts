export class WordCache {
    private searches: { [searchTerm: string]: string[] } = {};

    public containsSearch(searchTerm: string): boolean {
        return this.searches.hasOwnProperty(searchTerm);
    }

    public pushSearch(searchTerm: string, searchResult: string[]): void  {
        if (!this.containsSearch(searchTerm)) {
            this.searches[searchTerm] = searchResult;
        }
    }

    public getSearch(searchTerm: string): string[] {
        return this.searches[searchTerm];
    }

    public popRandomWord(searchTerm: string): string {
        if (!this.containsSearch(searchTerm)) {
            return "";
        }
        const words: string[] = this.getSearch(searchTerm);
        if (words.length === 0) {
            return "";
        }
        const randomWordIndex: number = Math.floor(Math.random() * (words.length - 1));

        return (words.splice(randomWordIndex, 1))[0];
    }

}
