import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { TracksManagementComponent } from "./tracks-management.component";
import { TrackManagerService } from "../track-manager.service";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";
import { TrackPoint, TrackInformation } from "../../../../../../common/racing/constants";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

/*tslint:disable:no-magic-numbers*/
const POINTS_ONE: TrackPoint[] = [
    {
        x: 105.14999237060545,
        z: -54.29999542236273
    },
    {
        x: -150.45,
        z: -261.29999694824164
    },
    {
        x: -117.45000762939453,
        z: 64.50000457763728
    }
];
const POINTS_TWO: TrackPoint[] = [
    {
        x: 105.14999237060545,
        z: -54.29999542236273
    },
    {
        x: -150.45,
        z: -261.29999694824164
    },
    {
        x: -117.45000762939453,
        z: 64.50000457763728
    }
];
let MOCKTRACK_ONE: TrackInformation ;
MOCKTRACK_ONE =  new TrackInformation();
let MOCKTRACK_TWO: TrackInformation ;
MOCKTRACK_TWO = new TrackInformation();
MOCKTRACK_ONE.points = POINTS_ONE;
MOCKTRACK_TWO.points = POINTS_TWO;
MOCKTRACK_ONE._id = "one";
MOCKTRACK_TWO._id = "two";
MOCKTRACK_ONE.name = "Done";
MOCKTRACK_TWO.name = "Dtwo";
const mockTracks: TrackInformation[] = [MOCKTRACK_ONE, MOCKTRACK_TWO];
class MockTrackService {
    public getTrack(url: string): Observable<TrackInformation> {
        return of(MOCKTRACK_ONE);
    }
    public getTracks(): Observable<TrackInformation[]> {
        return of(mockTracks);
    }

    public delete(track: TrackInformation): Observable<void> {
        mockTracks.filter((t) => t !== track);

        return of (undefined);
    }

}

describe("TracksManagementComponent", () => {
    let component: TracksManagementComponent;
    let fixture: ComponentFixture<TracksManagementComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TracksManagementComponent],
            imports: [RouterModule,
                      RouterTestingModule],
            providers: [{ provide: TrackManagerService, useClass: MockTrackService },
                        HttpClient,
                        HttpHandler]
        })
            .compileComponents()
            .catch(() => {
                throw new Error("TracksManagement Component could not be created");
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TracksManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create ", () => {
        expect(component).toBeTruthy();
    });

    describe("Testing if tracks  are displayed is correctly", () => {
        it("should decrease the track size", () => {

            let track: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(".element");
            expect(track.length).toEqual(component["tracks"].length);
            expect(track[0].textContent).toContain("Done");
            expect(track[1].textContent).toContain("Dtwo");
            fixture.detectChanges();
            component.delete(MOCKTRACK_ONE);
            fixture.detectChanges();
            track = fixture.nativeElement.querySelectorAll(".element");
            expect(track.length).toEqual(1);
            expect(track[0]).not.toContain("Done");
        });
    });

});
