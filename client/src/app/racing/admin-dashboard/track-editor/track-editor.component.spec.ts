import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TrackEditorComponent } from "./track-editor.component";
import { EditorRendererService } from "../../rendering/editor-renderer.service";
import {TrackManagerService} from "../track-manager.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";
import { Vector3 } from "three";
import { TrackInformation, TrackPoint } from "../../../../../../common/racing/constants";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Track } from "../../track/track";
import { TrackInformationImporter } from "../track-parser/trackInformationParser";
/*tslint:disable: no-magic-numbers*/
const MOCK_SEGMENT_POINTS_INVALID: Vector3[] = [];
MOCK_SEGMENT_POINTS_INVALID.push(new Vector3(0, 0, -50));
MOCK_SEGMENT_POINTS_INVALID.push(new Vector3(-50, 0, 0));
MOCK_SEGMENT_POINTS_INVALID.push(new Vector3(1222, 1111, 50));

const MOCK_SEGMENT_POINTS: Vector3[] = [];
MOCK_SEGMENT_POINTS.push(new Vector3(0, 0, -50));
MOCK_SEGMENT_POINTS.push(new Vector3(-50, 0, 0));
MOCK_SEGMENT_POINTS.push(new Vector3(0, 0, 50));
MOCK_SEGMENT_POINTS.push(new Vector3(30, 0, 30));
MOCK_SEGMENT_POINTS.push(new Vector3(50, 0, 0));
const points: TrackPoint[] = [
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
MOCKTRACK.points = points;
class MockTrackService {
    public getTrack(url: string): Observable<TrackInformation> {
      return of(MOCKTRACK);
    }
  }

describe("TrackEditorComponent", () => {
    let component: TrackEditorComponent;
    let fixture: ComponentFixture<TrackEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackEditorComponent],
            imports: [FormsModule,
                      RouterTestingModule,
                      RouterModule],
            providers: [EditorRendererService,
                        {provide : TrackManagerService , useClass: MockTrackService},
                        HttpClient,
                        HttpHandler]
        })
        .compileComponents()
        .catch(() => {
            throw new Error("TrackEditor Component could not be created");
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackEditorComponent);
        component = fixture.componentInstance;
        component.getTrack();
        component["editorRendererService"]["_track"] = new Track();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    describe("Testing we can only save a track when information are valid ", () => {
        it("Should not save when name or description is empty", () => {
            component["editorRendererService"].importTrack(MOCK_SEGMENT_POINTS_INVALID);
            expect(component["isValidInformations"]()).toBe(false);
            component.trackInformation.description = "Thing";
            expect(component["isValidInformations"]()).toBe(false);
            component.trackInformation.name = "skurt";
            expect(component["isValidInformations"]()).toBe(false);
        });
        it("Should save when track is valid to be saved", () => {
            component["editorRendererService"].importTrack(TrackInformationImporter.parse(MOCKTRACK));
            component.trackInformation.description = "Thing";
            component.trackInformation.name = "skurt";
            expect(component["isValidInformations"]()).toBe(true);
        });
    });

});
