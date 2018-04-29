import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameHudComponent } from "./game-hud.component";

const MOCK_LAP: number = 2;
const MOCK_MAX_LAP: number = 3;
const MOCK_RPM: number = 1200;
const MOCK_GEAR: number = 2;
const MOCK_SPEED: number = 60;
const MOCK_TIME: number = 109876;
const MOCK_LAP_TIME: number = 54321;

describe("GameHudComponent", () => {
    let component: GameHudComponent;
    let fixture: ComponentFixture<GameHudComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameHudComponent]
        })
            .compileComponents()
            .then()
            .catch();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameHudComponent);
        component = fixture.componentInstance;
        component.lap = MOCK_LAP;
        component.maxLap = MOCK_MAX_LAP;
        component.rpm = MOCK_RPM;
        component.gear = MOCK_GEAR;
        component.speed = MOCK_SPEED;
        component.totalTime = MOCK_TIME;
        component.lapTime = MOCK_LAP_TIME;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should display the number of laps finished", () => {
        const divElement: Element = fixture.nativeElement.querySelector(".lap-value");
        expect(divElement.innerHTML).toContain(MOCK_LAP.toString() + "/" + MOCK_MAX_LAP.toString());
    });

    it("should display the total time elapsed in the right format", () => {
        const divElement: Element = fixture.nativeElement.querySelector("#total_time");
        expect(divElement.innerHTML).toContain("01:49.88");
    });

    it("should display the time elapse since the start of the lap in the right format", () => {
        const divElement: Element = fixture.nativeElement.querySelector("#lap_time");
        expect(divElement.innerHTML).toContain("00:54.32");
    });

    it("should display the speed of the car in the right format", () => {
        const divElement: Element = fixture.nativeElement.querySelector("#speed-value");
        expect(divElement.innerHTML).toContain("60.00");
    });

    it("should display the correct gear of the car", () => {
        const divElement: Element = fixture.nativeElement.querySelector("#gear-value");
        expect(divElement.innerHTML).toContain((MOCK_GEAR + 1).toString());
    });

    it("should increase meter bar rotation when speed increases", () => {
        const rotationBefore: number = component.getMeterBarRotationDegrees(component.getSpeedPercentage(), false);
        component.speed = MOCK_SPEED + 1;
        fixture.detectChanges();
        const rotationAfter: number = component.getMeterBarRotationDegrees(component.getSpeedPercentage(), false);
        expect(rotationBefore).toBeLessThan(rotationAfter);
    });

    it("should increase meter bar rotation when rpm increases", () => {
        const rotationBefore: number = component.getMeterBarRotationDegrees(component.getRpmPercentage(), false);
        component.rpm = MOCK_RPM + 1;
        fixture.detectChanges();
        const rotationAfter: number = component.getMeterBarRotationDegrees(component.getRpmPercentage(), false);
        expect(rotationBefore).toBeLessThan(rotationAfter);
    });

});
