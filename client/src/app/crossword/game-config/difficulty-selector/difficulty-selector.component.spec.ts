import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { DifficultySelectorComponent } from "./difficulty-selector.component";
import { GameDifficulty } from "../../../../../../common/crossword/constant";

describe("DifficultySelectorComponent", () => {
    let component: DifficultySelectorComponent;
    let fixture: ComponentFixture<DifficultySelectorComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultySelectorComponent]
        })
        .compileComponents()
        .catch(() => {
            throw new Error("DifficultySelector Component could not be created");
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultySelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should assign Easy to selectedDifficulty", () => {
        component.selectedEvent.subscribe((value: GameDifficulty) => {
            expect(value.toString()).toBe(GameDifficulty[GameDifficulty.Easy]);
        });
        fixture.nativeElement.querySelector("#Easy").click();
        fixture.detectChanges();
    });

    it("should assign Medium to selectedDifficulty", () => {
        component.selectedEvent.subscribe((value: GameDifficulty) => {
            expect(value.toString()).toBe(GameDifficulty[GameDifficulty.Medium]);
        });
        fixture.nativeElement.querySelector("#Medium").click();
        fixture.detectChanges();
    });

    it("should assign Hard to selectedDifficulty", () => {
        component.selectedEvent.subscribe((value: GameDifficulty) => {
            expect(value.toString()).toBe(GameDifficulty[GameDifficulty.Hard]);
        });
        fixture.nativeElement.querySelector("#Hard").click();
        fixture.detectChanges();
    });

});
