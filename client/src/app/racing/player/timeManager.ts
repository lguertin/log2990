export class TimeManager {
    private _startLapDate: number;
    private _currentTime: number;

    public constructor() {
        this._startLapDate = 0;
    }

    public updateTime(): void {
        this._currentTime = new Date().getTime();
    }

    public setStartTime(): void {
        this._startLapDate = new Date().getTime();
    }

    private hasLapStarted(): boolean {
        return this._startLapDate !== 0;
    }

    private get timeSinceStartLap(): number {
        return this._currentTime - this._startLapDate;
    }

    public get lapTime(): number {
        return this.hasLapStarted() ? this.timeSinceStartLap : 0;
    }
}
