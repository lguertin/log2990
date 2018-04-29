import { Cell } from "./cell";
import * as CONSTANT from "./gridConstants";
import { Direction, GridWord, DiscoveryState } from "../../../../../common/crossword/constant";
import { PlayerID } from "../services/constants";

export class Grid {
    private _cells: Cell[][];
    private _gridWords: GridWord[];

    public constructor() {
        this.initializeGrid();
    }

    public get gridWords(): GridWord[] {
        return this._gridWords;
    }

    public set gridWords(gridWords: GridWord[]) {
        this._gridWords = gridWords;
    }

    public get cells(): Cell[][] {
        return this._cells;
    }

    public getCell(i: number, j: number): Cell {
        return this._cells[i][j];
    }

    public initializeGrid(): void {
        this._cells = [];
        for (let i: number = 0; i < CONSTANT.GRID_DIVISION; i++) {
            this._cells[i] = [];
            for (let j: number = 0; j < CONSTANT.GRID_DIVISION; j++) {
                this._cells[i][j] = { i: i,
                                      j: j,
                                      letter: CONSTANT.FILLED_CELL_SYMBOL,
                                      discoveryState: DiscoveryState.NonDiscovered,
                                      input: CONSTANT.EMPTY_INPUT };
            }
        }
    }

    public applyWordsOnGrid(): void {
        for (const word of this._gridWords) {
            if (word.direction === Direction.VERTICAL) {
                for (let i: number = 0; i < word.word.length; i++) {
                    this._cells[word.posI + i][word.posJ].letter = word.word[i];
                }
            } else {
                for (let j: number = 0; j < word.word.length; j++) {
                    this._cells[word.posI][word.posJ + j].letter = word.word[j];
                }
            }
        }
    }

    public nextCell(cell: Cell, selectedWord: GridWord): Cell {
        if (cell && selectedWord) {
            if (selectedWord.direction === Direction.HORIZONTAL) {
                if (cell.j - selectedWord.posJ < selectedWord.word.length - 1) {
                    return this._cells[cell.i][cell.j + 1];
                }
            } else {
                if (cell.i - selectedWord.posI < selectedWord.word.length - 1) {
                    return this._cells[cell.i + 1][cell.j];
                }
            }
        }

        return undefined;
    }

    public nextUndiscoveredCell(cell: Cell, selectedWord: GridWord): Cell {
        let nextCell: Cell = this.nextCell(cell, selectedWord);
        while (nextCell && nextCell.discoveryState) {
            nextCell = this.nextCell(nextCell, selectedWord);
        }

        return nextCell;
    }

    public previousCell(cell: Cell, selectedWord: GridWord): Cell {
        if (selectedWord.direction === Direction.HORIZONTAL) {
            if (cell.j > selectedWord.posJ) {
                return this._cells[cell.i][cell.j - 1];
            }
        } else {
            if (cell.i > selectedWord.posI) {
                return this._cells[cell.i - 1][cell.j];
            }
        }

        return undefined;
    }

    public previousUndiscoveredCell(cell: Cell, selectedWord: GridWord): Cell {
        let previousCell: Cell = this.previousCell(cell, selectedWord);
        while (previousCell && previousCell.discoveryState) {
            previousCell = this.previousCell(previousCell, selectedWord);
        }

        return previousCell;
    }

    public discoverSelectedWordCells(selectedWord: GridWord, player: PlayerID): void {
        for (let i: number = 0; i  < selectedWord.word.length; i++) {
            if (selectedWord.direction === Direction.HORIZONTAL) {
                this.findDiscoveredState( this._cells[selectedWord.posI][selectedWord.posJ + i], player);
            } else {
                this.findDiscoveredState( this._cells[selectedWord.posI + i][selectedWord.posJ], player);
            }
        }
    }

    private findDiscoveredState(cell: Cell, player: PlayerID): void {
        switch (cell.discoveryState) {
            case DiscoveryState.NonDiscovered :
                cell.discoveryState = player === PlayerID.SELF ? DiscoveryState.DiscoveredSelf : DiscoveryState.DiscoveredOpponent;
                break;
            case DiscoveryState.DiscoveredSelf:
                cell.discoveryState = player === PlayerID.SELF ? DiscoveryState.DiscoveredSelf : DiscoveryState.DiscoveredBoth;
                break;
            case DiscoveryState.DiscoveredOpponent:
                cell.discoveryState = player === PlayerID.SELF ? DiscoveryState.DiscoveredBoth : DiscoveryState.DiscoveredOpponent;
                break;
            default:
                cell.discoveryState = DiscoveryState.DiscoveredBoth;

        }
    }
}
