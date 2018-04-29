import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {TrackManagerService} from "../admin-dashboard/track-manager.service";
import { TrackInformation } from "../../../../../common/racing/constants";
@Component({
    selector: "app-track-selection",
    templateUrl: "./track-selection.component.html",
    styleUrls: ["./track-selection.component.css"]
})
export class TrackSelectionComponent implements OnInit {
    public tracks: TrackInformation[];
    public isShowingTrackInfo: boolean;
    public selectedTrack: TrackInformation;
    @Output() public selectedEvent: EventEmitter<TrackInformation>;

    public constructor(private trackManager: TrackManagerService) {
        this.selectedEvent = new EventEmitter<TrackInformation>();
        this.isShowingTrackInfo = false;
        this.tracks = [];
        this.selectedTrack = new TrackInformation();
    }

    public ngOnInit(): void {
        this.trackManager.getTracks()
        .subscribe((trackInformations: TrackInformation[]) => {
            this.tracks = trackInformations;
        });
    }

    public onTrackSelect(track: TrackInformation): void {
        this.selectedTrack = this.isShowingTrackInfo ? this.selectedTrack : track;
        this.isShowingTrackInfo = true;
    }

    public playTrack(): void {
        this.selectedTrack.numberOfTimesPlayed++;
        this.trackManager.update(this.selectedTrack).subscribe();
    }

    public closeTrackInfo(): void {
        this.selectedTrack = undefined;
        this.isShowingTrackInfo = false;
    }
}
