import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { EndGameComponent } from "./end-game.component";
import { EndGameOptions, GameMode, GameDifficulty } from "../../../../../../common/crossword/constant";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("EndGameSelectorComponent", () => {
    let component: EndGameComponent;
    let fixture: ComponentFixture<EndGameComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EndGameComponent],
            providers: [HttpClient,
                        HttpHandler]
        })
        .compileComponents()
        .then()
        .catch(() => {
            throw new Error("EndGame Component could not be created");
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameComponent);
        component = fixture.componentInstance;
        component.gridInformation.points.push(0);
        component.gridInformation.points.push(0);
        component.gridInformation.difficulty = GameDifficulty.Easy;
        component.gridInformation.maxPoints = 2;
        component.gridInformation.mode = GameMode.Solo;
        component.gridInformation.players = [];
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should assign Replay to selectedDifficulty", () => {
        component.selectedEvent.subscribe((value: EndGameOptions) => {
            expect(value.toString()).toBe(EndGameOptions[EndGameOptions.Replay]);
        });
        fixture.nativeElement.querySelector("#Replay").click();
        fixture.detectChanges();
    });

    it("should assign Menu to selectedDifficulty", () => {
        component.selectedEvent.subscribe((value: EndGameOptions) => {
            expect(value.toString()).toBe(EndGameOptions[EndGameOptions.Menu]);
        });
        fixture.nativeElement.querySelector("#Menu").click();
        fixture.detectChanges();
    });

    describe("Testing if the correct end message is sent", () => {
        it("should return solo end message", () => {
            expect(component["message"]).toBe("Congratulation! You have finished the crossword!");

        });

        it("should return win end message", () => {
            component.gridInformation.players = ["A", "B"];
            component["gridInformation"].mode = GameMode.Multiplayer;
            component["gridInformation"].points[0] = 1;
            component.ngOnInit();
            expect(component["message"]).toBe("Congratulation! You have beaten your opponent and won the game. The final score is: 1 - 0");
        });

        it("should return loss end message", () => {
            component.gridInformation.players = ["A", "B"];
            component["gridInformation"].mode = GameMode.Multiplayer;
            component["gridInformation"].points[1] = 1;
            component.ngOnInit();
            expect(component["message"]).toBe("Sorry :( You have lost the game. The final score is: 0 - 1");
        });

        it("should return even end message", () => {
            component.gridInformation.players = ["A", "B"];
            component["gridInformation"].mode = GameMode.Multiplayer;
            component["gridInformation"].points[0] = 1;
            component["gridInformation"].points[1] = 1;
            component.ngOnInit();
            expect(component["message"]).toBe(
                "Your battle as been evenly fought! You have the same number of points. The final score is: 1 - 1");
        });
    });

});
