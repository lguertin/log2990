import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Cell } from "../cell";
import { KEY_TAB, KEY_BACKSPACE, WordValidation, CELL_TYPE_DISCOVERED_SELF, CELL_TYPE_NON_SELECTED,
            CELL_TYPE_SELECTED, CELL_TYPE_SELECTED_CURRENT } from "../gridConstants";
import { GridWord, DiscoveryState } from "../../../../../../common/crossword/constant";
import { WordSelectionService } from "../../services/word-selection.service";
import { PlayerID } from "../../services/constants";
import { AbstractGrid } from "../abstractGridComponent";

@Component({
    selector: "app-grid-solo",
    templateUrl: "../grid.component.html",
    styleUrls: ["./gridSolo.component.css"]
})

export class SoloGridComponent extends AbstractGrid implements OnInit {

    @Input("gridWords") public set gridWords(value: GridWord[]) {
        this.grid.gridWords = value;
    }

    @HostListener("document:keyup", ["$event"]) public handleKeyboardEvent(event: KeyboardEvent): void {
        if (this.currentCell) {
            if (event.key !== KEY_TAB) {
                if (event.key === KEY_BACKSPACE) {
                    this.onBackspace();
                } else {
                    this.handleKeyPress(event.key);
                }
            }
        }
    }

    public constructor(protected wordSelectionService: WordSelectionService) {
        super(wordSelectionService);
    }

    public ngOnInit(): void {
        this.grid.applyWordsOnGrid();
    }

    protected wordSelectionServiceWordSubscription(): void {
        this.wordSelectionService.redirectGridWordSelection().subscribe((word) => {
            this.clearSelectedCells();
            this.selectedWord = word;

            let cell: Cell = this.grid.getCell(word.posI, word.posJ);
            if (cell.discoveryState) {
                cell = this.grid.nextUndiscoveredCell(cell, this.selectedWord);
            }
            if (cell) {
                this.currentCell = cell;
            } else {
                this.deselectWord();
            }
        });
    }

    protected selectedCellType(cell: Cell): string {
        if (this.selectedWord !== undefined) {
            if (this.isCurrentCell(cell)) {
                return CELL_TYPE_SELECTED_CURRENT;
            } else if (this.isSelectedCell(cell, this.selectedWord)) {
                return CELL_TYPE_SELECTED;
            }
        }

        return CELL_TYPE_NON_SELECTED;
    }

    protected discoveredCellType(cell: Cell): string {
        return cell.discoveryState !== DiscoveryState.NonDiscovered ? CELL_TYPE_DISCOVERED_SELF : CELL_TYPE_NON_SELECTED;
    }

    protected deselectWord(): void {
        this.clearSelectedCells();
        this.currentCell = undefined;
        this.selectedWord = undefined;
        this.wordSelectionService.cellSelected(undefined);
    }

    public validateWord(): boolean {
        if (this.checkWordInput()) {
            this.grid.discoverSelectedWordCells(this.selectedWord, PlayerID.SELF);
            const valideWord: WordValidation = {word: this.selectedWord, player: PlayerID.SELF};
            this.wordSelectionService.wordCompletion(valideWord);
            this.playerOneScoreIncrement.emit();

            return true;
        }

        return false;
    }

}
