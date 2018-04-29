import { Car } from "../car/car";
import { TimeManager } from "./timeManager";
import { Waypoint } from "../track/waypoint/waypoint";
import { Statistics, RANDOM_TIME_MULTIPLIER, LOCAL_PLAYER_NAME } from "./constants";
import { MAX_LAPS } from "../game-manager/constants";
import { Vector3 } from "three";
import { MathUtils } from "../utils/math-utils";

export class Player {
    protected _name: string;
    protected _waypoint: Waypoint;
    protected _timer: TimeManager;
    protected _statistics: Statistics;
    protected _numberbOfWaypointsCrossed: number;
    protected _hasCrossedStartingLine: boolean;

    private static get initialStatistics(): Statistics {
        return {
            currentLap : 1,
            lapTimes: [],
            finalTime: 0,
        };
    }

    public constructor(protected _car: Car, private _numberbOfWaypointsToCross: number) {
        this._name = LOCAL_PLAYER_NAME;
        this._timer = new TimeManager();
        this._waypoint = new Waypoint(new Vector3(0, 0, 0));
        this._statistics = Player.initialStatistics;
        this._numberbOfWaypointsCrossed = 0;
        this._hasCrossedStartingLine = false;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get car(): Car {
        return this._car;
    }

    public set car(car: Car) {
        this._car = car;
    }

    public get currentLapTime(): number {
        return this._timer.lapTime;
    }

    public get currentTotalTime(): number {
        return this.currentLapTime + MathUtils.sum(...this._statistics.lapTimes);
    }

    public update(): void {
        this.updateWaypoint();
        if (this.hasFinishedLap() && !this.hasFinishedRace()) {
            this._statistics.currentLap += 1;
            this._numberbOfWaypointsCrossed = 0;
            this.calculateLapTime();
        }
        this._timer.updateTime();
    }

    private calculateLapTime(): void {
        this._statistics.lapTimes.push(this._timer.lapTime);
        this._timer.setStartTime();
    }

    public set waypoint(waypoint: Waypoint) {
        this._waypoint = waypoint;
    }

    protected updateWaypoint(): void {
        if (this._car.hasCrossedWaypoint(this._waypoint)) {
            this._waypoint = this._waypoint.next;
            if (this._hasCrossedStartingLine) {
                this._numberbOfWaypointsCrossed++;
            } else {
                this._hasCrossedStartingLine = true;
            }
        }
    }

    private hasFinishedLap(): boolean {
        return this._numberbOfWaypointsCrossed === this._numberbOfWaypointsToCross;
    }

    private hasFinishedRace(): boolean {
        return this.statistics.currentLap > MAX_LAPS;
    }

    public get statistics(): Statistics {
        return this._statistics;
    }

    public initiateLapTimer(): void {
        this._statistics.lapTimes = [];
        this._timer.setStartTime();
    }

    public simulateUnfinishedLapsTime(): void {
        if (!this.hasFinishedRace()) {
            this._statistics.lapTimes.push(this._timer.lapTime * this._numberbOfWaypointsToCross
                                           / Math.max(this._numberbOfWaypointsCrossed, 1));
        }
        for (let i: number = this.statistics.currentLap; i < MAX_LAPS; i++) {
            this._statistics.lapTimes.push(this.calculateEstimationNextLapTime());
        }
    }

    private calculateEstimationNextLapTime(): number {
        return Math.ceil(MathUtils.average(...this._statistics.lapTimes) * (Math.random() / (Math.random() * RANDOM_TIME_MULTIPLIER) + 1));
    }
}
