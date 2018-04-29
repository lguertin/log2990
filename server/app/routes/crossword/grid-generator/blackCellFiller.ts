import { Direction, BLACK_CELL, EMPTY_CELL } from "../../../../../common/crossword/constant";
import { Grid } from "./grid";
import { MINIMUM_WORD_LENGTH, HORIZONTAL_PROBABILITY, VERTICAL_PROBABILITY} from "./constant";

export class BlackCellFiller {

    public static execute(grid: Grid): void {
        this.fillGridWithBlackCells(grid);
        this.removeBlackCells(grid, Direction.HORIZONTAL);
        this.removeBlackCells(grid, Direction.VERTICAL);
    }

    private static fillGridWithBlackCells(grid: Grid): void {
        for (let i: number = 0; i < grid.getDimension(); i++) {
            for (let j: number = 0; j < grid.getDimension(); j++) {
                grid.setCellValue(i, j, BLACK_CELL);
            }
        }
    }

    private static removeBlackCells(grid: Grid, direction: Direction): void {
        for (let i: number = 0; i < grid.getDimension();) {
            for (let j: number = 0; j < grid.getDimension();) {
                if (i < grid.getDimension()) {
                    let probability: number = Math.ceil(Math.random() * (grid.getDimension()
                                            - (direction === Direction.HORIZONTAL ? HORIZONTAL_PROBABILITY : VERTICAL_PROBABILITY))
                                            + MINIMUM_WORD_LENGTH);
                    while (probability > 0 && j < grid.getDimension()) {
                        if (direction === Direction.HORIZONTAL) {
                            grid.setCellValue(i, j, EMPTY_CELL);
                        } else {
                            grid.setCellValue(j, i, EMPTY_CELL);
                        }

                        probability--;
                        j++;
                    }
                    i++;
                    j += MINIMUM_WORD_LENGTH;
                }
            }
        }
    }
}
