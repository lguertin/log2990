import { Cell } from "./cell";
import { INTEROGATION_MARK } from "../constant";
import { EMPTY_CELL } from "../../../../../../common/crossword/constant";

export class Word {
    constructor(private word: string) {
        this.removeSymbols();
    }

    public static getWordFromCellList(cells: Cell[]): string {
        let word: string = "";
        for (const cell of cells) {
            word += cell.getLetter();
        }

        return word;
    }

    public static getWordFromCellListForLexicon(cells: Cell[]): string {
        let word: string = "";
        for (const cell of cells) {
            if (cell.getLetter() === EMPTY_CELL) {
                word += INTEROGATION_MARK;
            } else {
                word += cell.getLetter();
            }
        }

        return word;
    }

    public removeSymbols(): void {
        this.word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        this.word = this.word.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    }

    public getWord(): string {
        return this.word;
    }

    public setWord(word: string): void {
        this.word = word;
        this.removeSymbols();

    }
}
