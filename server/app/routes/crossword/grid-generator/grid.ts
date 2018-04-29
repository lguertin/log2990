import {Cell} from "./cell";
import { Direction, EMPTY_CELL, BLACK_CELL } from "../../../../../common/crossword/constant";

export class Grid {
    private cells: Cell[][] ;

    constructor(private dimension: number) {
        this.cells = [];
        for (let i: number = 0; i < this.dimension; i++) {
            this.cells[i] = [];
            for (let j: number = 0; j < this.dimension; j++) {
                this.cells[i][j] = new  Cell(i, j, EMPTY_CELL);
            }
        }
    }

    public getCellsToBlack(i: number, j: number, direction: Direction): Cell[] {
        const list: Array<Cell> = [];

        if (!this.isOutOfBound(i) && !this.isOutOfBound(j)) {
            if (direction === Direction.HORIZONTAL) {
                for (let y: number = j; y < this.dimension && this.cells[i][y].getLetter() !== BLACK_CELL; y++ ) {
                    list.push(this.cells[i][y]);
                }
            } else {
                for (let x: number = i; x < this.dimension && this.cells[x][j].getLetter() !== BLACK_CELL; x++) {
                    list.push(this.cells[x][j]);
                }
            }
        }

        return list;
    }

    public isOutOfBound(pos: number): boolean {
        return (pos >= this.dimension || pos < 0);
    }

    public getCellsDistanceToBlack(i: number, j: number, direction: Direction): number {
       return (this.getCellsToBlack(i, j, direction).length);
    }

    public getCell(i: number, j: number): Cell {
        return this.cells[i][j];
    }

    public getDimension(): number {
        return this.dimension;
    }

    public useCells(cells: Cell[]): void {
        for (const cell of cells) {
            cell.increaseUsedCounter();
        }
    }

    public unUseCells(cells: Cell[]): void {
        for (const cell of cells) {
            cell.decreaseUsedCounter();
            if (cell.getUsedCounter() === 0) {
                this.setCellValue(cell.getI(), cell.getJ(), EMPTY_CELL);
            }
        }
    }

    public setCellValue(i: number, j: number, value: string): void {
        this.cells[i][j].setLetter(value);
    }

    public isBlackCellAtPosition(i: number, j: number): boolean {
        return !(!this.isOutOfBound(i) && !this.isOutOfBound(j) && this.cells[i][j].getLetter() !== BLACK_CELL);
    }
}
