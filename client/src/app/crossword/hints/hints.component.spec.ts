import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {WordSelectionService} from "../services/word-selection.service";
import { HintsComponent } from "./hints.component";
import { MOCK_WORDS } from "../mock-word";
import { Direction } from "../../../../../common/crossword/constant";

describe("HintsComponent", () => {
    let component: HintsComponent;
    let fixture: ComponentFixture<HintsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HintsComponent],
            providers: [WordSelectionService]
        })
        .compileComponents()
        .catch(() => {
            throw new Error("Hints Component could not be created");
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HintsComponent);
        component = fixture.componentInstance;
        component.gridWords = MOCK_WORDS;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should contain a hint for every word", () => {
        const hints: HTMLCollection = fixture.nativeElement.getElementsByClassName("definition");
        expect(hints.length).toEqual(MOCK_WORDS.length);
    });

    it("should seperate horizontal and vertical hints", () => {
        const hintsHorizontal: NodeListOf<Element> = fixture.nativeElement.querySelector("#horizontal-definitions-list")
                                                                          .querySelector(".definitions-list")
                                                                          .querySelectorAll(".definition");
        const hintsVertical: NodeListOf<Element> = fixture.nativeElement.querySelector("#vertical-definitions-list")
                                                                        .querySelector(".definitions-list")
                                                                        .querySelectorAll(".definition");
        let nHorizontalWords: number = 0;
        let nVerticalWords: number = 0;
        for (const word of component.gridWords ) {
            if (word.direction === Direction.HORIZONTAL) {
                nHorizontalWords++;
            } else {
                nVerticalWords++;
            }
        }

        expect(nHorizontalWords).toEqual(hintsHorizontal.length);
        expect(nVerticalWords).toEqual(hintsVertical.length);
    });

    /* tslint:disable: no-magic-numbers */
    it("should show word descriptions", () => {
        const hints: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(".definition");
        expect(hints.item(0).innerHTML).toContain(component.gridWords[0].definition);
        expect(hints.item(1).innerHTML).toContain(component.gridWords[1].definition);
        expect(hints.item(2).innerHTML).toContain(component.gridWords[2].definition);
    });
});
