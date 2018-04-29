import { Output, EventEmitter } from "@angular/core";
import { Cell } from "./cell";
import {
    GRID_DIVISION, MAX_PERCENTAGE, FILLED_CELL_SYMBOL, EMPTY_INPUT,
    CELL_TYPE_NON_SELECTED, CELL_TYPE_FILLED, CELL_TYPE_EMPTY
} from "./gridConstants";
import { Direction, GridWord, DiscoveryState } from "../../../../../common/crossword/constant";
import { WordSelectionService } from "../services/word-selection.service";
import { Grid } from "./grid";

export abstract class AbstractGrid {
    @Output() public playerOneScoreIncrement: EventEmitter<void>;
    @Output() public playerTwoScoreIncrement: EventEmitter<void>;

    public grid: Grid;
    public cellSize: string;
    public gridPositions: number[];
    public selectedWord: GridWord;
    protected currentCell: Cell;
    protected isSelectedFromHint: boolean;

    public constructor(protected wordSelectionService: WordSelectionService) {
        this.playerOneScoreIncrement = new EventEmitter<void>();
        this.playerTwoScoreIncrement = new EventEmitter<void>();
        this.grid = new Grid();
        this.initGridPositions();
        this.cellSize = this.getCellSizePercentage() + "%";
        this.wordSelectionServiceSelectedWordSubscription();
        this.wordSelectionServiceWordSubscription();
    }

    protected wordSelectionServiceSelectedWordSubscription(): void {
        this.wordSelectionService.redirectHintSelection().subscribe((isSelected) => {
            this.isSelectedFromHint = isSelected;
            if (!isSelected) {
                this.deselectWord();
            }
        });
    }

    protected abstract wordSelectionServiceWordSubscription(): void;

    protected abstract selectedCellType(cell: Cell): string;

    protected abstract discoveredCellType(cell: Cell): string;

    protected abstract deselectWord(): void;

    protected abstract validateWord(): boolean;

    public initGridPositions(): void {
        this.gridPositions = new Array<number>();
        for (let i: number = 1; i <= GRID_DIVISION; i++) {
            this.gridPositions.push(i);
        }
    }

    public getCellClass(cell: Cell): string {

        const type: string = this.cellType(cell);

        if (type === CELL_TYPE_NON_SELECTED) {
            return cell.letter === FILLED_CELL_SYMBOL ? CELL_TYPE_FILLED : CELL_TYPE_EMPTY;
        }

        return type;
    }

    protected isCurrentCell(cell: Cell): boolean {
        return this.currentCell.i === cell.i && this.currentCell.j === cell.j;
    }

    protected isSelectedCell(cell: Cell, word: GridWord): boolean {

        if (word.direction === Direction.VERTICAL) {
            if (cell.j === word.posJ) {
                if (cell.i >= word.posI && cell.i < word.posI + word.word.length) {
                    return true;
                }
            }
        } else if (word.direction === Direction.HORIZONTAL) {
            if (cell.i === word.posI) {
                if (cell.j >= word.posJ && cell.j < word.posJ + word.word.length) {
                    return true;
                }
            }
        }

        return false;
    }

    protected cellType(cell: Cell): string {
        return this.grid.getCell(cell.i, cell.j).discoveryState !== DiscoveryState.NonDiscovered ?
            this.discoveredCellType(cell) : this.selectedCellType(cell);
    }

    protected getCellSizePercentage(): number {
        return MAX_PERCENTAGE / Math.max(GRID_DIVISION, 1);
    }

    public onSelect(cell: Cell): void {
        if (cell.letter !== FILLED_CELL_SYMBOL) {
            this.clearSelectedCells();
            this.currentCell = cell;
            this.selectHint(cell);
        } else {
            if (this.selectedWord) {
                this.deselectWord();
            }
        }
    }

    protected selectHint(cell: Cell): void {
        this.wordSelectionService.cellSelected(cell);
    }

    public onClickOutside(): void {
        if (!this.isSelectedFromHint) {
            this.deselectWord();
        }
        this.wordSelectionService.cellSelected(undefined);
    }

    protected getAlphabeticChars(str: string): string[] {
        return str.match(/[a-zA-Z]/g);
    }

    protected checkAlphabeticKeyPress(key: string): boolean {
        if (this.getAlphabeticChars(key) !== null) {
            return this.getAlphabeticChars(key).length === 1;
        }

        return false;
    }

    public handleKeyPress(key: string): void {
        if (this.checkAlphabeticKeyPress(key) && !this.currentCell.discoveryState) {
            this.currentCell.input = key.toUpperCase();
            if (!this.nextCell()) {
                if (this.validateWord()) {
                    this.deselectWord();
                } else {
                    this.clearSelectedCells();
                    this.currentCell = this.grid.getCell(this.selectedWord.posI, this.selectedWord.posJ);
                    if (this.currentCell.discoveryState) {
                        this.currentCell = this.grid.nextUndiscoveredCell(this.currentCell, this.selectedWord);
                    }
                }
            }
        }
    }

    public onBackspace(): void {
        if (this.grid.previousUndiscoveredCell(this.currentCell, this.selectedWord)) {
            this.currentCell = this.grid.previousUndiscoveredCell(this.currentCell, this.selectedWord);
            this.currentCell.input = EMPTY_INPUT;
        }
    }

    protected nextCell(): Cell {
        if (this.grid.nextUndiscoveredCell(this.currentCell, this.selectedWord)) {
            return this.currentCell = this.grid.nextUndiscoveredCell(this.currentCell, this.selectedWord);
        }

        return undefined;
    }

    protected checkWordInput(): boolean {
        if (!this.selectedWord.word) {
            return false;
        }
        for (let i: number = 0; i < this.selectedWord.word.length; i++) {
            if (this.selectedWord.direction === Direction.HORIZONTAL) {
                if (this.grid.cells[this.selectedWord.posI][this.selectedWord.posJ + i].input
                    !== this.selectedWord.word[i].toUpperCase()) {
                    return false;
                }
            } else {
                if (this.grid.cells[this.selectedWord.posI + i][this.selectedWord.posJ].input
                    !== this.selectedWord.word[i].toUpperCase()) {
                    return false;
                }
            }
        }

        return true;
    }

    protected clearSelectedCells(): void {
        if (this.selectedWord) {
            for (let i: number = 0; i < this.selectedWord.word.length; i++) {
                if (this.selectedWord.direction === Direction.HORIZONTAL) {
                    if (!this.grid.getCell(this.selectedWord.posI, this.selectedWord.posJ + i).discoveryState) {
                        this.grid.cells[this.selectedWord.posI][this.selectedWord.posJ + i].input = EMPTY_INPUT;
                    }
                } else {
                    if (!this.grid.getCell(this.selectedWord.posI + i, this.selectedWord.posJ).discoveryState) {
                        this.grid.cells[this.selectedWord.posI + i][this.selectedWord.posJ].input = EMPTY_INPUT;
                    }
                }
            }
        }
    }

}
