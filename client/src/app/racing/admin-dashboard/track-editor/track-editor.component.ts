import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Vector2 } from "three";
import { EditorRendererService } from "../../rendering/editor-renderer.service";
import { ActivatedRoute } from "@angular/router";
import { TrackManagerService } from "../track-manager.service";
import { TrackInformation } from "../../../../../../common/racing/constants";
import { Location } from "@angular/common";
import { TrackInformationExporter, TrackInformationImporter } from "../track-parser/trackInformationParser";

const MOUSE_LEFT_BUTTON: number = 0;
const MOUSE_RIGHT_BUTTON: number = 2;
const EDITOR_PARENT_ID: string = "editor";
const NEW_TRACK_ID: string = "new";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"]
})
export class TrackEditorComponent implements AfterViewInit {

    private mousePressed: boolean;
    private positionMousePressed: Vector2;
    public trackInformation: TrackInformation;
    public readonly id: string;
    @ViewChild("container")
    private containerRef: ElementRef;

    private static getParentElement(event: MouseEvent): Element {
        return (event.target as Element).parentElement;
    }

    private static toVector2(event: MouseEvent): Vector2 {
        return new Vector2(event.clientX, event.clientY);
    }

    public constructor(private route: ActivatedRoute,
                       private trackManager: TrackManagerService,
                       private editorRendererService: EditorRendererService,
                       private location: Location) {
        this.mousePressed = false;
        this.positionMousePressed = new Vector2();
        this.trackInformation = new TrackInformation();
        this.id = this.route.snapshot.paramMap.get("id");
    }

    public ngAfterViewInit(): void {
        this.editorRendererService
            .initialize(this.containerRef.nativeElement)
            .then()
            .catch((err: string) => console.error(err));

        this.getTrack();
    }

    private isInEditor(event: MouseEvent): boolean {
        return TrackEditorComponent.getParentElement(event) && TrackEditorComponent.getParentElement(event).id === EDITOR_PARENT_ID;
    }

    public getTrack(): void {
        if (this.id !== NEW_TRACK_ID) {
            this.trackManager.getTrack(this.id)
                .subscribe((track: TrackInformation) => {
                    this.trackInformation = track;
                    this.editorRendererService.importTrack(
                        TrackInformationImporter.parse(this.trackInformation));
                });
        }
    }

    public goBack(): void {
        this.location.back();
    }

    private isValidInformations(): boolean {
        return (this.trackInformation.name !== ""
        &&      this.trackInformation.description !== ""
        &&      this.editorRendererService.isValidTrack() );
    }

    public save(): void {
        if (this.isValidInformations()) {
            this.updateInformations();
            if (this.id === "new") {
                this.trackManager.insert(this.trackInformation)
                    .subscribe(() => this.goBack());
            } else {
                this.trackManager.update(this.trackInformation)
                    .subscribe(() => this.goBack());
            }
        }

    }
    private updateInformations(): void {
        TrackInformationExporter.parse(this.editorRendererService.track, this.trackInformation);
        this.trackInformation.image = this.editorRendererService.takeTrackScreenShot();
    }

    public saveAs(): void {
        if (this.isValidInformations()) {
            this.updateInformations();
            this.trackInformation.numberOfTimesPlayed = 0;
            this.trackInformation.bestTimes = [];

            this.trackManager.insert(this.trackInformation)
                .subscribe(() => this.goBack());
        }
    }
    public getInputClass(value: string): string {
        return value !== "" ? "valid" : "invalid";
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.editorRendererService.onResize();
    }

    @HostListener("window:mousedown", ["$event"])
    public mouseDown(event: MouseEvent): void {
        if (this.isInEditor(event)) {
            this.mousePressed = true;
            this.positionMousePressed = TrackEditorComponent.toVector2(event);
            this.editorRendererService.mouseDownCommand.execute(event);
        }
    }

    @HostListener("window:mouseup", ["$event"])
    public mouseUp(event: MouseEvent): void {
        this.mousePressed = false;
        this.editorRendererService.mouseUpCommand.execute(event);
    }

    @HostListener("window:mousemove", ["$event"])
    public mouseMove(event: MouseEvent): void {
        if (this.isInEditor(event)) {
            if (this.mousePressed) {
                this.editorRendererService.dragCommand.execute(event);
            }
        }
    }

    @HostListener("window:click", ["$event"])
    public mouseClick(event: MouseEvent): void {
        if (this.positionMousePressed) {
            if (this.positionMousePressed.equals(TrackEditorComponent.toVector2(event))) {
                if (event.button === MOUSE_LEFT_BUTTON) {
                    this.editorRendererService.leftClickCommand.execute(event);
                }
            }
        }
    }

    @HostListener("window:contextmenu", ["$event"])
    public remove(event: MouseEvent): void {
        event.preventDefault();
        if (event.button === MOUSE_RIGHT_BUTTON) {
            this.editorRendererService.rightClickCommand.execute(event);
        }
    }
}
