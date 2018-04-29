import { Component, OnInit } from "@angular/core";
import { TrackManagerService } from "../track-manager.service";
import { TrackInformation } from "../../../../../../common/racing/constants";

const MAX_COLUMNS: number = 4;

@Component({
    selector: "app-tracks-management",
    templateUrl: "./tracks-management.component.html",
    styleUrls: ["./tracks-management.component.css"]
})
export class TracksManagementComponent implements OnInit {

    private tracks: TrackInformation[];
    public trackColumns: TrackInformation[][];

    private static filterFunction(trackInformation: TrackInformation): (t: TrackInformation) => boolean {
        return (t: TrackInformation) => t !== trackInformation;
    }

    public constructor(private trackManager: TrackManagerService) {
        this.tracks = [];
        this.trackColumns = [];
     }

    private initializeTrackColumns(): void {
        for (let i: number = 0; i < MAX_COLUMNS; i++) {
            this.trackColumns[i] = new Array();
        }
    }

    public ngOnInit(): void {
        this.trackManager.getTracks()
        .subscribe((tracks: TrackInformation[]) => {
            this.tracks  = tracks;
            this.divideTracksIntoColumns();
        });
    }

    private divideTracksIntoColumns(): void {
        this.initializeTrackColumns();
        for (let i: number = 0; i < this.tracks.length; i++) {
            this.trackColumns[i % MAX_COLUMNS].push(this.tracks[i]);
        }
    }

    public delete(track: TrackInformation): void {
        this.trackManager.delete(track).subscribe();
        this.deleteFromTracks(track);
        this.deleteFromTrackColumns(track);
        this.divideTracksIntoColumns();
    }

    private deleteFromTracks(track: TrackInformation): void {
        this.tracks = this.tracks.filter(TracksManagementComponent.filterFunction(track));
    }

    private deleteFromTrackColumns(track: TrackInformation): void {
        for (let i: number = 0; i < MAX_COLUMNS; i++) {
            this.trackColumns[i] = this.trackColumns[i].filter(TracksManagementComponent.filterFunction(track));
        }
    }
}
