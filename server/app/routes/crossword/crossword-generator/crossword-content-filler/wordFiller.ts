import { WordSlot } from "../constant";
import { GameDifficulty, Direction, EMPTY_CELL } from "../../../../../../common/crossword/constant";
import { CrossWordGrid } from "../types/crosswordGrid";
import { Word } from "../types/word";
import { Cell } from "../types/cell";
import "reflect-metadata";
import { WordDispenser } from "../wordDispenser";

export class WordFiller {
    private insertedItemsHistory: Array<WordSlot>;
    private positionsToBeFilled: Array<WordSlot>;
    private usedWordList: string[];
    private wordDispenser: WordDispenser;

    constructor(private difficulty: GameDifficulty) {
        this.positionsToBeFilled = [];
        this.insertedItemsHistory = [];
        this.usedWordList = [];
        this.wordDispenser = new WordDispenser(this.difficulty);
    }

    public execute(grid: CrossWordGrid): void {
        this.initializePositionToBeFilled(grid);
        this.fillWordOnGrid(grid);

    }

    public get insertedWordsHistory(): Array<WordSlot> {
        return this.insertedItemsHistory;
    }

    private fillWordOnGrid(grid: CrossWordGrid): void {
        while (this.positionsToBeFilled.length !== 0) {
            this.sortWordPositionByLettersPlaced(grid);
            const positionToPlace: WordSlot = this.positionsToBeFilled.pop();
            const currentCells: Cell[] = (grid.getCellsToBlack(positionToPlace.posI,
                                                               positionToPlace.posJ,
                                                               positionToPlace.direction));
            const partWord: string = Word.getWordFromCellListForLexicon(currentCells);
            const wordToInsert: string = this.wordDispenser.getWord(partWord);

            if (wordToInsert === "" || this.usedWordList.indexOf(wordToInsert) !== -1) {
                this.positionsToBeFilled.push(positionToPlace);
                this.backTrack(grid, currentCells);
            } else {
                positionToPlace.word = new Word(wordToInsert);
                this.addWord(grid, positionToPlace);
                this.usedWordList.push(wordToInsert);
            }
        }
    }

    private backTrack(grid: CrossWordGrid, cells: Cell[]): void {
        let areCellsEmpty: boolean = false;
        while (!areCellsEmpty) {
            let historyIndex: number = 0;
            while (historyIndex < this.insertedItemsHistory.length) {
                const historyWord: WordSlot = this.insertedItemsHistory[historyIndex];
                if (this.hasCommonCells(cells, grid.getCellsToBlack(historyWord.posI, historyWord.posJ, historyWord.direction))) {
                    this.swapHistoryElements(historyIndex, this.insertedItemsHistory.length - 1);
                    const lastWord: WordSlot = this.insertedItemsHistory.pop();
                    this.positionsToBeFilled.push(lastWord);
                    this.removeWordOfGrid(grid, lastWord);
                } else {
                    historyIndex++;
                }
            }

            areCellsEmpty = this.checkIfCellsEmpty(cells);
        }
    }

    private checkIfCellsEmpty(cells: Cell[]): boolean {
        for (const cell of cells) {
            if (cell.getLetter() !== EMPTY_CELL) {
                return  false;
            }
        }

        return true;
    }

    private initializePositionToBeFilled(grid: CrossWordGrid): void {
        for (let i: number = 0; i < grid.getDimension(); i++) {
            for (let j: number = 0; j < grid.getDimension(); j++) {
                const horizontalDistance: number = grid.getCellsDistanceToBlack(i, j, Direction.HORIZONTAL);
                const verticalDistance: number = grid.getCellsDistanceToBlack(i, j, Direction.VERTICAL);

                this.initializeHorizontalWord(horizontalDistance, grid, j, i);
                this.initializeVerticalWord(verticalDistance, grid, i, j);
            }
        }
    }

    private initializeVerticalWord(verticalDistance: number, grid: CrossWordGrid, i: number, j: number): void {
        if (verticalDistance > 1 && ((!grid.isOutOfBound(i - 1)
            && grid.isBlackCellAtPosition(i - 1, j)) || (grid.isOutOfBound(i - 1)))) {
            const newPosition: WordSlot = {
                posI: i, posJ: j, direction: Direction.VERTICAL,
                length: verticalDistance, word: undefined
            };
            this.positionsToBeFilled.push(newPosition);
        }
    }

    private initializeHorizontalWord(horizontalDistance: number, grid: CrossWordGrid, j: number, i: number): void {
        if (horizontalDistance > 1 && ((!grid.isOutOfBound(j - 1)
            && grid.isBlackCellAtPosition(i, j - 1)) || (grid.isOutOfBound(j - 1)))) {
            const newPosition: WordSlot = {
                posI: i, posJ: j, direction: Direction.HORIZONTAL,
                length: horizontalDistance, word: undefined
            };
            this.positionsToBeFilled.push(newPosition);
        }
    }

    private sortWordPositionByLettersPlaced(grid: CrossWordGrid): void {
        this.positionsToBeFilled.sort((a: WordSlot, b: WordSlot) => {
            const aCells: Cell[] = grid.getCellsToBlack(a.posI, a.posJ, a.direction);
            const bCells: Cell[] = grid.getCellsToBlack(b.posI, b.posJ, b.direction);
            const aNbOfIntersect: number = this.numberOfIntersectingLetter(aCells);
            const bNbOfIntersect: number = this.numberOfIntersectingLetter(bCells);

            if (aNbOfIntersect < bNbOfIntersect) {
                return -1;
            } else if (aNbOfIntersect > bNbOfIntersect) {
                return 1;
            } else {
                if (aCells.length < bCells.length) {
                    return -1;
                } else if (aCells.length > bCells.length) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    private numberOfIntersectingLetter(cells: Cell[]): number {
        let counter: number = 0;
        for (const cell of cells) {
            if (cell.getLetter() !== EMPTY_CELL) { counter++; }
        }

        return counter;
    }

    private placeWordOnGrid(grid: CrossWordGrid, word: WordSlot): void {
        const cells: Cell[] = grid.getCellsToBlack(word.posI, word.posJ, word.direction);
        for (let x: number = 0; x < cells.length; x++) {
            cells[x].setLetter(word.word.getWord()[x]);
        }
        grid.useCells(cells);
    }
    private removeWordOfGrid(grid: CrossWordGrid, word: WordSlot): string {
        const cells: Cell[] = grid.getCellsToBlack(word.posI, word.posJ, word.direction);
        grid.unUseCells(cells);

        return Word.getWordFromCellList(cells);
    }

    private addWord(grid: CrossWordGrid, word: WordSlot): void {
        this.placeWordOnGrid(grid, word);
        this.insertedItemsHistory.push(word);
    }

    private hasCommonCells(cells1: Cell[], cells2: Cell[]): boolean {
        for (const cell1 of cells1) {
            for (const cell2 of cells2) {
                if (cell2 === cell1) {
                    return true;
                }
            }
        }

        return false;
    }

    private swapHistoryElements(index1: number, index2: number): void {
        const temp: WordSlot = this.insertedItemsHistory[index1];
        this.insertedItemsHistory[index1] = this.insertedItemsHistory[index2];
        this.insertedItemsHistory[index2] = temp;
    }

}
