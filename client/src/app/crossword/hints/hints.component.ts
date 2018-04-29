import { Component, OnInit, Input } from "@angular/core";
import { Direction, GridWord, DiscoveryState } from "../../../../../common/crossword/constant";
import { Hint } from "./hint";
import { WordSelectionService } from "../services/word-selection.service";
import { Cell } from "../grid/cell";
import { PlayerID } from "../services/constants";

@Component({
    selector: "app-hints",
    templateUrl: "./hints.component.html",
    styleUrls: ["./hints.component.css"]
})

export class HintsComponent implements OnInit {

    @Input("gridWords") public gridWords: GridWord[];

    public cheatModeisActive: boolean;

    private horizontalHints: Hint[];
    private verticalHints: Hint[];
    private lastSelectedHint: Hint;
    private selectedFromGrid: boolean;

    public constructor(private wordSelectionService: WordSelectionService) {
        this.horizontalHints = new Array<Hint>();
        this.verticalHints = new Array<Hint>();
        this.cheatModeisActive = false;

        this.wordSelectionService.redirectCellSelection().subscribe((cell) => {
            if (cell && this.getHintFromCell(cell)) {
                this.onSelect(this.getHintFromCell(cell));
                this.selectedFromGrid = true;
            } else {
                this.selectedFromGrid = false;
            }
        });

        this.wordSelectionService.redirectWordCompletion().subscribe((validateWord) => {
            if (this.getHintFromGridWords(validateWord.word)) {
                this.getHintFromGridWords(validateWord.word).discoveryState = validateWord.player === PlayerID.SELF ?
                    DiscoveryState.DiscoveredSelf : DiscoveryState.DiscoveredOpponent;
                this.deselectHint(this.lastSelectedHint);
            }
        });
    }

    public ngOnInit(): void {
        this.divideGridWords();
        this.sortGridWords();
    }

    public toggleCheatMode(isActive: boolean): void {
        this.cheatModeisActive = isActive;
    }

    public onClickOutside(): void {
        if (!this.selectedFromGrid) {
            this.deselectHint(this.lastSelectedHint);
            this.wordSelectionService.hintSelection(false);
        }
    }

    public onSelect(hint: Hint): void {
        if (!hint.discoveryState) {
            this.wordSelectionService.hintSelected(hint);
            this.wordSelectionService.hintSelection(true);
            this.deselectHint(this.lastSelectedHint);
            this.selectHint(hint);
        }
    }

    public getClassName(hint: Hint): string {
        if ( hint.discoveryState !== DiscoveryState.NonDiscovered) {
            return hint.discoveryState === DiscoveryState.DiscoveredSelf ? "definition discoveredMe" : "definition discoveredOpponent";
        }

        return "definition";

    }

    private selectHint(hint: Hint): void {
        if (hint) {
            hint.isSelected = true;
            this.lastSelectedHint = hint;
        }
    }

    private deselectHint(hint: Hint): void {
        if (hint) {
            hint.isSelected = false;
        }
    }

    private getHintFromCell(cell: Cell): Hint {
        return this.checkInHorizontalHints(cell) ? this.checkInHorizontalHints(cell) : this.checkInVerticalHints(cell);
    }

    private checkInHorizontalHints(cell: Cell): Hint {
        for (const hoHint of this.horizontalHints) {
            if (hoHint.gridWord.posI === cell.i && !hoHint.discoveryState) {
                if (hoHint.gridWord.posJ <= cell.j
                    && cell.j <= hoHint.gridWord.posJ + hoHint.gridWord.word.length ) {
                        return hoHint;
                }
            }
        }

        return undefined;
    }

    private checkInVerticalHints(cell: Cell): Hint {
        for (const verHint of this.verticalHints) {
            if (verHint.gridWord.posJ === cell.j && !verHint.discoveryState) {
                if (verHint.gridWord.posI <= cell.i
                    && cell.j <= verHint.gridWord.posJ + verHint.gridWord.word.length ) {
                        return verHint;
                }
            }
        }

        return undefined;
    }

    private divideGridWords(): void {
        for (const word of this.gridWords) {
            const hint: Hint = {gridWord: word, discoveryState: DiscoveryState.NonDiscovered, isSelected: false};
            if (word.direction === Direction.VERTICAL) {
                this.verticalHints.push(hint);
            } else {
                this.horizontalHints.push(hint);
            }
        }
    }

    private sortGridWords(): void {
        this.horizontalHints.sort(this.sortHintByPosI);
        this.verticalHints.sort(this.sortHintByPosJ);
    }

    private sortHintByPosI(hint1: Hint, hint2: Hint): number {
        if (hint1.gridWord.posI > hint2.gridWord.posI) {
            return 1;
        }
        if (hint1.gridWord.posI < hint2.gridWord.posI) {
            return -1;
        }

        return 0;
    }

    private sortHintByPosJ(hint1: Hint, hint2: Hint): number {
        if (hint1.gridWord.posJ > hint2.gridWord.posJ) {
            return 1;
        }
        if (hint1.gridWord.posJ < hint2.gridWord.posJ) {
            return -1;
        }

        return 0;
    }

    private getHintFromGridWords(gridWord: GridWord): Hint {
        return this.findHintFromHintsWithGridWords(this.horizontalHints, gridWord) ?
               this.findHintFromHintsWithGridWords(this.horizontalHints, gridWord) :
               this.findHintFromHintsWithGridWords(this.verticalHints, gridWord);
    }

    private findHintFromHintsWithGridWords(hints: Hint[], gridWord: GridWord): Hint {
        for (const hint of hints) {
            if (hint.gridWord.word === gridWord.word) {
                return hint;
            }
        }

        return undefined;
    }
}
