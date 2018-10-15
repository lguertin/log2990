/* tslint:disable:no-magic-numbers */
import { expect, assert } from "chai";
import { CrossWordGrid } from "./crosswordGrid";
import { BLACK_CELL, Direction } from "../../../../../../common/crossword/constant";

const SMALL_GRID: number = 2;
const MEDIUM_GRID: number = 8;

const blackCellLocations: Array<{i: number, j: number}> = [
    {i: 0, j: 3},
    {i: 0, j: 5},
    {i: 3, j: 4},
    {i: 7, j: 4}
];

describe("Grid", () => {
    const grid: CrossWordGrid = new CrossWordGrid(SMALL_GRID);

    const grid2: CrossWordGrid = new CrossWordGrid(MEDIUM_GRID);

    for (const blackCellLocation of blackCellLocations) {
        grid2.setCellValue(blackCellLocation.i, blackCellLocation.j, BLACK_CELL);
    }

    describe("Creating 2 by 2 grid", () => {
        it("should have a blank cell letter on (i,j)=(1,1)", () => {
            expect(grid.getCell(1, 1).getLetter()).to.equal(" ");
        });
    });

    describe("Check if a position is out of bounds of the grid", () => {
        it("should be out of bound if accessing index " + MEDIUM_GRID + " of grid size " + MEDIUM_GRID, () => {
            expect(grid2.isOutOfBound(MEDIUM_GRID)).to.equal(true);
        });
        it("should not be out of bound if accessing index " + MEDIUM_GRID + "-1 of grid size" + MEDIUM_GRID, () => {
            expect(grid2.isOutOfBound(MEDIUM_GRID - 1)).to.equal(false);
        });
        it("should not be out of bound if accessing index 0", () => {
            expect(grid.isOutOfBound(0)).to.equal(false);
        });
        it("should be out of bound if index is negative", () => {
            expect(grid2.isOutOfBound(-1)).to.equal(true);
        });
        it("should not be out of bound if index is within grid size", () => {
            expect(grid2.isOutOfBound(6)).to.equal(false);
        });
    });
    describe("Check if the distance to a black cell is correct", () => {
        it("should return 2 if there is no black cell at the end and 2 white cells", () => {
            expect(grid.getCellsDistanceToBlack(0, 0, Direction.HORIZONTAL)).to.equal(2);
        });
        it("should return 3 if there is 3 white cells and then a black cell horizontally", () => {
            expect(grid2.getCellsDistanceToBlack(0, 0, Direction.HORIZONTAL)).to.equal(3);
        });
        it("should return 1 if there is 1 white cells and then a black cell horizontally", () => {
            expect(grid2.getCellsDistanceToBlack(0, 4, Direction.HORIZONTAL)).to.equal(1);
        });
        it("should return 2 if there is 2 white cells and then a black cell horizontally", () => {
            expect(grid2.getCellsDistanceToBlack(0, 6, Direction.HORIZONTAL)).to.equal(2);
        });
        it("should return 3 if there is 3 white cells and then a black cell vertically", () => {
            expect(grid2.getCellsDistanceToBlack(0, 4, Direction.VERTICAL)).to.equal(3);
        });
        it("should return 3 if there is 3 white cells and the end of the grid cell vertically", () => {
            expect(grid2.getCellsDistanceToBlack(4, 4, Direction.VERTICAL)).to.equal(3);
        });
    });
    describe("Checking if we can get cells until a black", () => {
        it("Should return an emplty array", () => {
            assert.lengthOf(grid.getCellsToBlack(0, 0, Direction.HORIZONTAL), 2, "The cells list has a distance of 2");
        });
        it("Should return an array of 3  element", () => {
            assert.lengthOf(grid2.getCellsToBlack(0, 0, Direction.HORIZONTAL), 3, "The cells list has a distance of 3");
        });
        it("Should return an array of 8  element", () => {
            assert.lengthOf(grid2.getCellsToBlack(0, 0, Direction.VERTICAL), 8, "The cells list has a distance of 3");
        });
    });
});
