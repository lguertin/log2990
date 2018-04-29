import { Component, Input } from "@angular/core";
import { MAX_LAPS } from "../../game-manager/constants";

const MAX_SPEED: number = 300;
const MAX_RPM: number = 8000;
const PERCENTAGE_FACTOR: number = 100;
const METER_BAR_CLIPPING_POINT: number = 50;
const MAX_METER_ROTATION: number = 360;
const CLIPPING_STYLE_CLASSES: string = "bar-mask clipping";
const NONCLIPPING_STYLE_CLASSES: string = "bar-mask";

@Component({
    selector: "app-game-hud",
    templateUrl: "./game-hud.component.html",
    styleUrls: ["./game-hud.component.css"]
})
export class GameHudComponent {

    public maxLap: number;
    @Input("lap") public lap: number;
    @Input("totalTime") public totalTime: number;
    @Input("lapTime") public lapTime: number;
    @Input("speed") public speed: number;
    @Input("gear") public gear: number;
    @Input("rpm") public rpm: number;

    public constructor() {
        this.maxLap = MAX_LAPS;
    }

    public getSpeedPercentage(): number {
        return (this.speed / MAX_SPEED) * PERCENTAGE_FACTOR;
    }

    public getRpmPercentage(): number {
        return (this.rpm / MAX_RPM) * PERCENTAGE_FACTOR;
    }

    public getSpeedMeterClipMask(percentage: number): string {
        return percentage < METER_BAR_CLIPPING_POINT ? CLIPPING_STYLE_CLASSES : NONCLIPPING_STYLE_CLASSES;
    }

    private getLeftBarRotation(percentage: number): number {
        return Math.min(MAX_METER_ROTATION / 2, percentage * MAX_METER_ROTATION  / PERCENTAGE_FACTOR);
    }

    private getRightBarRotation(percentage: number): number {
        return percentage * MAX_METER_ROTATION  / PERCENTAGE_FACTOR;
    }

    private getRelativeMeterBarRotationDegrees(percentage: number, isLeftBar: boolean): number {
        return isLeftBar ? this.getLeftBarRotation(percentage) : this.getRightBarRotation(percentage);
    }

    public getMeterBarRotationDegrees(percentage: number, isLeftBar: boolean): number {
        return this.getRelativeMeterBarRotationDegrees(percentage, isLeftBar) - MAX_METER_ROTATION / 2;
    }

    public getMeterBarTransform(percentage: number, isLeftBar: boolean): string {
        return "rotate(" + this.getMeterBarRotationDegrees(percentage, isLeftBar).toString() + "deg)";
    }

}
