import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameInfoComponent } from "./game-info.component";
import { GameDifficulty, GameMode } from "../../../../../common/crossword/constant";

const MAX_POINTS: number = 100;

describe("GameInfoComponent", () => {
    let component: GameInfoComponent;
    let fixture: ComponentFixture<GameInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameInfoComponent]
        })
            .compileComponents()
            .catch(() => {
                throw new Error("Game-Info Component could not be created");
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameInfoComponent);
        component = fixture.componentInstance;
        component.difficulty = GameDifficulty.Medium;
        component.maxPoints = MAX_POINTS;
        component.mode = GameMode.Solo;
        component.points = [0, 0];
        component.players = ["PlayerUno", "PlayerDos"];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show gamemode depending on the gamemode chosen", () => {
        expect(fixture.nativeElement.querySelector("#mode_value").innerHTML).toContain("Solo");

        component.mode = GameMode.Multiplayer;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("#mode_value").innerHTML).toContain("Multiplayer");
    });

    /* tslint:disable: no-magic-numbers */
    it("should show 2 player names if in 1v1 mode", () => {
        component.mode = GameMode.Multiplayer;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll(".player-name-container").length).toEqual(2);
    });

    it("should show 2 points bar if in 1v1 mode", () => {
        component.mode = GameMode.Multiplayer;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll(".points-bar-container").length).toEqual(2);
    });
});
