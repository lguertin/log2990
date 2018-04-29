
export interface PlayerBestTime{
     name:string;
     time: number;
}

export class TrackInformation {
    public _id: string;
    public name: string;
    public description: string;
    public image: string;
    public bestTimes: PlayerBestTime[];
    public numberOfTimesPlayed: number;
    public points: TrackPoint[];
    public constructor() {
        this.points = new Array<TrackPoint>();
        this.name = "";
        this.description = "";
        this.bestTimes = [];
        this.numberOfTimesPlayed = 0;

        
    }

}

export class TrackPoint {
    constructor(public x: number, public z: number) { }
}