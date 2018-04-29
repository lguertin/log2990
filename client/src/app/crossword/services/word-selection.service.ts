import { Injectable } from "@angular/core";
import { Hint } from "../hints/hint";
import { GridWord } from "../../../../../common/crossword/constant";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Cell } from "../grid/cell";
import { WordValidation } from "../grid/gridConstants";

@Injectable()
export class WordSelectionService {
    private hintObservable: Subject<Hint>;
    private gridWordEmit: Subject<GridWord>;
    private cellObservable: Subject<Cell>;
    private wordCompletionObservable: Subject<WordValidation>;
    private hintSelectionObservable: Subject<boolean>;

    public constructor() {
        this.hintObservable = new Subject<Hint>();
        this.gridWordEmit = new Subject<GridWord>();
        this.cellObservable = new Subject<Cell>();
        this.wordCompletionObservable = new Subject<WordValidation>();
        this.hintSelectionObservable = new Subject<boolean>();
        this.hintObservable.subscribe((value) => {
            this.emitGridWord(value.gridWord);
        });
    }

    private emitGridWord(value: GridWord): void {
        this.gridWordEmit.next(value);
    }

    public redirectGridWordSelection(): Observable<GridWord> {
        return this.gridWordEmit;
    }

    public hintSelected(hint: Hint): void {
        this.hintObservable.next(hint);
    }

    public redirectCellSelection(): Observable<Cell> {
        return this.cellObservable;
    }

    public cellSelected(cell: Cell): void {
        this.cellObservable.next(cell);
        this.redirectCellSelection();
    }

    public redirectWordCompletion(): Observable<WordValidation> {
        return this.wordCompletionObservable;
    }

    public wordCompletion(valideWord: WordValidation): void {
        this.wordCompletionObservable.next(valideWord);
        this.redirectWordCompletion();
    }

    public redirectHintSelection(): Observable<boolean> {
        return this.hintSelectionObservable;
    }

    public hintSelection(isSelected: boolean): void {
        this.hintSelectionObservable.next(isSelected);
        this.redirectHintSelection();
    }
}
