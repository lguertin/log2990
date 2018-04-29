import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Cell } from "../cell";
import { KEY_TAB, KEY_BACKSPACE, WordValidation, CELL_TYPE_DISCOVERED_BOTH,
            CELL_TYPE_DISCOVERED_OPPONENT, CELL_TYPE_DISCOVERED_SELF, CELL_TYPE_NON_SELECTED,
            CELL_TYPE_MULTIPLAYER_SELECTED_OPPONENT, CELL_TYPE_MULTIPLAYER_SELECTED_SELF,
            CELL_TYPE_MULTIPLAYER_SELECTED_BOTH, CELL_TYPE_MULTIPLAYER_SELECTED_CURRENT,
            CELL_TYPE_MULTIPLAYER_SELECTED_BOTH_CURRENT } from "../gridConstants";
import { Direction, GridWord, DiscoveryState } from "../../../../../../common/crossword/constant";
import { WordSelectionService } from "../../services/word-selection.service";
import { SocketsService } from "../../services/sockets.service";
import { PlayerID } from "../../services/constants";
import { AbstractGrid } from "../abstractGridComponent";

@Component({
    selector: "app-grid-multiplayer",
    templateUrl: "../grid.component.html",
    styleUrls: ["./gridMultiplayer.component.css"]
})
export class MultiplayerGridComponent extends AbstractGrid implements OnInit {
    public selectedWordOtherPlayer: GridWord;

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

    public constructor(protected wordSelectionService: WordSelectionService, protected socketsService: SocketsService) {
        super(wordSelectionService);
        this.socketServiceSubscription();
    }

    public ngOnInit(): void {
        this.grid.applyWordsOnGrid();
    }

    protected wordSelectionServiceWordSubscription(): void {
        this.wordSelectionService.redirectGridWordSelection().subscribe((word) => {
            this.clearSelectedCells();
            this.selectedWord = word;
            this.socketsService.sendSelectedWord(this.selectedWord);

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

    protected socketServiceSubscription(): void {
        this.socketsService.receiveValidateWord().subscribe((gridWord: GridWord) => {
            if (gridWord !== undefined && gridWord !== null) {
                this.grid.discoverSelectedWordCells(gridWord, PlayerID.OPPONENT);
                const valideWord: WordValidation = {word: gridWord, player: PlayerID.OPPONENT};
                this.wordSelectionService.wordCompletion(valideWord);
                this.fillValidatedCells(gridWord);
                this.playerTwoScoreIncrement.emit();
            }
        });

        this.socketsService.receiveSelectedWord().subscribe((gridWord: GridWord) => {
           this.selectedWordOtherPlayer = gridWord;
       });
    }

    protected selectedCellType(cell: Cell): string {

        if (this.selectedWord !== undefined) {
            if (this.isCurrentCell(cell)) {
                if (this.selectedWordOtherPlayer !== null && this.selectedWordOtherPlayer !== undefined) {
                    if (this.isSelectedCell(cell, this.selectedWordOtherPlayer)) {
                        return CELL_TYPE_MULTIPLAYER_SELECTED_BOTH_CURRENT;
                    }
                }

                return CELL_TYPE_MULTIPLAYER_SELECTED_CURRENT;
            } else if (this.isSelectedCell(cell, this.selectedWord)) {
                if (this.selectedWordOtherPlayer !== null && this.selectedWordOtherPlayer !== undefined) {
                    if (this.isSelectedCell(cell, this.selectedWordOtherPlayer )) {
                        return CELL_TYPE_MULTIPLAYER_SELECTED_BOTH;
                    }
                }

                return CELL_TYPE_MULTIPLAYER_SELECTED_SELF;
            }
        }
        if (this.selectedWordOtherPlayer !== null && this.selectedWordOtherPlayer !== undefined) {
            if (this.isSelectedCell(cell, this.selectedWordOtherPlayer)) {
                return CELL_TYPE_MULTIPLAYER_SELECTED_OPPONENT;
            }
        }

        return CELL_TYPE_NON_SELECTED;
    }

    protected discoveredCellType(cell: Cell): string {
        switch (cell.discoveryState) {
            case DiscoveryState.DiscoveredSelf:
                return CELL_TYPE_DISCOVERED_SELF;
            case DiscoveryState.DiscoveredOpponent:
                return CELL_TYPE_DISCOVERED_OPPONENT;
            case DiscoveryState.DiscoveredBoth:
                return CELL_TYPE_DISCOVERED_BOTH;
            default:
                return CELL_TYPE_NON_SELECTED;
        }
    }

    protected deselectWord(): void {
        this.clearSelectedCells();
        this.currentCell = undefined;
        this.selectedWord = undefined;
        this.wordSelectionService.cellSelected(undefined);
        this.socketsService.sendSelectedWord(undefined);
    }

    public validateWord(): boolean {
        if (this.checkWordInput()) {
            this.grid.discoverSelectedWordCells(this.selectedWord, PlayerID.SELF);
            const valideWord: WordValidation = {word: this.selectedWord, player: PlayerID.SELF};
            this.wordSelectionService.wordCompletion(valideWord);

            this.socketsService.sendValidatedWord(this.selectedWord);
            this.playerOneScoreIncrement.emit();

            return true;
        }

        return false;
    }

    public fillValidatedCells(word: GridWord): void {
        for (let i: number = 0; i < word.word.length; i++) {
            if (word.direction === Direction.HORIZONTAL) {
                    this.grid.cells[word.posI][word.posJ + i].input = word.word[i].toUpperCase();
            } else {
                    this.grid.cells[word.posI + i][word.posJ].input = word.word[i].toUpperCase();
            }
        }
    }
}
