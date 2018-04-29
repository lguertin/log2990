import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RacingCountdownComponent } from "./racing-countdown.component";
import { SoundService } from "../../sounds/sound.service";

describe("RacingCountdownComponent", () => {
    let component: RacingCountdownComponent;
    let fixture: ComponentFixture<RacingCountdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RacingCountdownComponent],
            providers: [SoundService]
        })
            .compileComponents()
            .then()
            .catch();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingCountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
