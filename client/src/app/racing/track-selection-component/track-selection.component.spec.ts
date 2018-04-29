import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TrackSelectionComponent } from "./track-selection.component";
import { TrackManagerService } from "../admin-dashboard/track-manager.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { TrackPoint, TrackInformation } from "../../../../../common/racing/constants";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

const POINTS: TrackPoint[] = [
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
const MOCKTRACK: TrackInformation = new TrackInformation();
MOCKTRACK.points = POINTS;
const MOCKTRACKS: TrackInformation[] = [MOCKTRACK];
MOCKTRACK.bestTimes  = [{name: "", time: 20000}, {name: "", time: 20000} , {name: "", time: 20000}];
MOCKTRACK.numberOfTimesPlayed = 0;

class MockTrackService {
    public getTrack(url: string): Observable<TrackInformation> {
      return of(MOCKTRACK);
    }
    public getTracks(url: string): Observable<TrackInformation[]> {
        return of(MOCKTRACKS);
      }
  }

describe("TrackSelectionComponent", () => {
    let component: TrackSelectionComponent;
    let fixture: ComponentFixture<TrackSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackSelectionComponent],
            providers: [{provide : TrackManagerService , useClass : MockTrackService},
                        HttpClient,
                        HttpHandler]
        })
            .compileComponents()
            .then(() => {})
            .catch(() => {});
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    describe("Testing if informations are coherents", () => {

        it("Should match the specified type", () => {
            for (const trackInformation of component.tracks) {
                expect(typeof(trackInformation.name)).toBe("string");
                expect(typeof(trackInformation.description)).toBe("string");
                expect(typeof(trackInformation.numberOfTimesPlayed)).toBe("number");
                expect(typeof(trackInformation.bestTimes)).toBe("object");
                expect(typeof(trackInformation.points)).toBe("object");
                expect(typeof(trackInformation.bestTimes[0].name)).toBe("string");
                expect(typeof(trackInformation.bestTimes[0].time)).toBe("number");
                expect(typeof(trackInformation.points[0].x)).toBe("number");
                expect(typeof(trackInformation.points[0].z)).toBe("number");
            }
        });
        it("Should sort best time before displaying it", () => {
            for (const trackInformation of component.tracks) {
                expect(trackInformation.bestTimes).toBe(MOCKTRACK.bestTimes.sort());
            }
        });
    });
});
