import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { TrackEditorComponent } from "./track-editor/track-editor.component";
import { TracksManagementComponent } from "./tracks-management/tracks-management.component";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";
import { EditorRendererService } from "../rendering/editor-renderer.service";

describe("AdminDashboardComponent", () => {
    let component: AdminDashboardComponent;
    let fixture: ComponentFixture<AdminDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminDashboardComponent,
                           TrackEditorComponent,
                           TracksManagementComponent],
            imports: [RouterTestingModule,
                      RouterModule,
                      FormsModule],
            providers: [EditorRendererService]
        })
        .compileComponents()
        .catch(() => {
            throw new Error("AdminDashboard Component could not be created");
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
