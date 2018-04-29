import { WordSlot } from "./constant";
import { GameDifficulty, Direction, EMPTY_CELL } from "../../../../../common/crossword/constant";
import { Grid } from "./grid";
import { Word } from "./word";
import { Cell } from "./cell";
import "reflect-metadata";
import { WordDispenser } from "./wordDispenser";

export class WordFiller {
    private history: Array<WordSlot>;
    private positionToPlace: Array<WordSlot>;
    private usedWordList: string[];
    private wordDispenser: WordDispenser;

    constructor(private difficulty: GameDifficulty) {
        this.positionToPlace = [];
        this.history = [];
        this.usedWordList = [];
        this.wordDispenser = new WordDispenser(this.difficulty);
    }

    private fillWordOnGrid(grid: Grid): void {
        while (this.positionToPlace.length !== 0) {
            this.sortWordPositionByLettersPlaced(grid);
            const newPosition: WordSlot = this.positionToPlace.pop();
            const partWord: string = Word.getWordFromCellListForLexicon(grid.getCellsToBlack(newPosition.posI,
                                                                                             newPosition.posJ,
                                                                                             newPosition.direction));
            const newWord: string = this.wordDispenser.getWord(partWord);
            if (newWord === "" || this.usedWordList.indexOf(newWord) !== -1) {
                this.positionToPlace.push(newPosition);
                this.backTrack(grid, grid.getCellsToBlack(newPosition.posI, newPosition.posJ, newPosition.direction));
            } else {
                newPosition.word = new Word(newWord);
                this.addWord(grid, newPosition);
                this.usedWordList.push(newWord);
            }
        }
    }

    private backTrack(grid: Grid, cells: Cell[]): void {
        let areCellsEmpty: boolean = false;
        while (!areCellsEmpty) {
            let historyIndex: number = 0;
            while (historyIndex < this.history.length) {
                const historyWord: WordSlot = this.history[historyIndex];
                if (this.isCommonCells(cells, grid.getCellsToBlack(historyWord.posI, historyWord.posJ, historyWord.direction))) {
                    this.swapHistoryElements(historyIndex, this.history.length - 1);
                    const lastWord: WordSlot = this.history.pop();
                    this.positionToPlace.push(lastWord);
                    this.removeWordOfGrid(grid, lastWord);
                } else {
                    historyIndex++;
                }
            }
            areCellsEmpty = true;
            for (const cell of cells) {
                if (cell.getLetter() !== EMPTY_CELL) {
                    areCellsEmpty = false;
                }
            }
        }
    }

    private setBeginingWordCellQueue(grid: Grid): void {
        for (let i: number = 0; i < grid.getDimension(); i++) {
            for (let j: number = 0; j < grid.getDimension(); j++) {
                const horizontalDistance: number = grid.getCellsDistanceToBlack(i, j, Direction.HORIZONTAL);
                const verticalDistance: number = grid.getCellsDistanceToBlack(i, j, Direction.VERTICAL);
                if (horizontalDistance > 1 && ((!grid.isOutOfBound(j - 1)
                    && grid.isBlackCellAtPosition(i, j - 1)) || (grid.isOutOfBound(j - 1)))) {
                    const newPosition: WordSlot = {
                        posI: i, posJ: j, direction: Direction.HORIZONTAL,
                        length: horizontalDistance, word: undefined
                    };
                    this.positionToPlace.push(newPosition);
                }
                if (verticalDistance > 1 && ((!grid.isOutOfBound(i - 1)
                    && grid.isBlackCellAtPosition(i - 1, j)) || (grid.isOutOfBound(i - 1)))) {
                    const newPosition: WordSlot = {
                        posI: i, posJ: j, direction: Direction.VERTICAL,
                        length: horizontalDistance, word: undefined
                    };
                    this.positionToPlace.push(newPosition);
                }
            }
        }
    }

    private sortWordPositionByLettersPlaced(grid: Grid): void {
        this.positionToPlace.sort((a: WordSlot, b: WordSlot) => {
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

    private placeWordOnGrid(grid: Grid, word: WordSlot): void {
        const cells: Cell[] = grid.getCellsToBlack(word.posI, word.posJ, word.direction);
        for (let x: number = 0; x < cells.length; x++) {
            cells[x].setLetter(word.word.getWord()[x]);
        }
        grid.useCells(cells);
    }
    private removeWordOfGrid(grid: Grid, word: WordSlot): string {
        const cells: Cell[] = grid.getCellsToBlack(word.posI, word.posJ, word.direction);
        grid.unUseCells(cells);

        return Word.getWordFromCellList(cells);
    }

    private addWord(grid: Grid, word: WordSlot): void {
        this.placeWordOnGrid(grid, word);
        this.history.push(word);
    }

    private isCommonCells(cells1: Cell[], cells2: Cell[]): boolean {
        for (const cell1 of cells1) {
            for (const cell2 of cells2) {
                if (cell2 === cell1) {
                    return true;
                }
            }
        }

        return false;
    }

    public getHistory(): Array<WordSlot> {
        return this.history;
    }

    private swapHistoryElements(index1: number, index2: number): void {
        const temp: WordSlot = this.history[index1];
        this.history[index1] = this.history[index2];
        this.history[index2] = temp;
    }

    public execute(grid: Grid): void {
        this.setBeginingWordCellQueue(grid);
        this.fillWordOnGrid(grid);

    }
}
