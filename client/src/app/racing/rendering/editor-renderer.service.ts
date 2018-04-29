import { Injectable } from "@angular/core";
import { Renderer } from "./abstract-renderer";
import { Points } from "../track/points";
import { MouseRaycaster } from "../mouseRaycaster/mouseRaycaster";
import { TopDownCamera } from "./camera/topDownCamera";
import { AbstractCommand } from "../admin-dashboard/track-editor/commands/AbstractCommand";
import { MouseLeftClickCommand } from "../admin-dashboard/track-editor/commands/mouseLeftClickCommand";
import { MouseRightClickCommand } from "../admin-dashboard/track-editor/commands/mouseRightClickCommand";
import { MouseDragCommand } from "../admin-dashboard/track-editor/commands/mouseDragCommand";
import { MouseDownCommand } from "../admin-dashboard/track-editor/commands/mouseDownCommand";
import { MouseUpCommand } from "../admin-dashboard/track-editor/commands/mouseUpCommand";
import { Vector3 } from "three";

const DEFAULT_EDITOR_ZOOM: number = 0.1;

@Injectable()
export class EditorRendererService extends Renderer {

    private _points: Points;
    private _mouseRaycaster: MouseRaycaster;
    private _mouseLeftClickCommand: MouseLeftClickCommand;
    private _mouseRightClickCommand: MouseRightClickCommand;
    private _mouseDownCommand: MouseDownCommand;
    private _mouseUpCommand: MouseUpCommand;
    private _mouseDragCommand: MouseDragCommand;

    public constructor() {
        super();
        this._mouseRaycaster = new MouseRaycaster();
        this._points = new Points();
    }

    private constructCommands(): void {
        this._mouseLeftClickCommand = new MouseLeftClickCommand(this);
        this._mouseRightClickCommand = new MouseRightClickCommand(this);
        this._mouseDownCommand = new MouseDownCommand(this);
        this._mouseUpCommand = new MouseUpCommand(this);
        this._mouseDragCommand = new MouseDragCommand(this);
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        super.initialize(container)
            .then(() => {/*Do nothing*/})
            .catch(() => {
                console.error("Editor Renderer: Can not initialize editor renderer");
            });
        this._mouseRaycaster.setCanvasWidthAndHeight(container.clientWidth, container.clientHeight);
        this.cameraManager.addCamera(new TopDownCamera("topCamera", this.containerWidth, this.containerHeight));
        this.cameraManager.activeCamera.setZoom(DEFAULT_EDITOR_ZOOM);
        this.constructCommands();
    }

    protected async createScene(): Promise<void> {
        await super.createScene();
        this.addMesh(this._points.lastPoint);
    }

    public onResize(): void {
        super.onResize();
        this._mouseRaycaster.setCanvasWidthAndHeight(this.containerWidth, this.containerHeight);
    }

    public get points(): Points {
        return this._points;
    }

    public get dragCommand(): AbstractCommand {
        return this._mouseDragCommand;
    }

    public get leftClickCommand(): AbstractCommand {
        return this._mouseLeftClickCommand;
    }

    public get rightClickCommand(): AbstractCommand {
        return this._mouseRightClickCommand;
    }

    public get mouseDownCommand(): MouseDownCommand {
        return this._mouseDownCommand;
    }

    public get mouseUpCommand(): MouseUpCommand {
        return this._mouseUpCommand;
    }

    public get raycaster(): MouseRaycaster {
        return this._mouseRaycaster;
    }

    public isValidTrack(): boolean {
        return this._track.isValid();
    }
    public importTrack(pointsVector: Vector3[]): void {
        super.importTrack(pointsVector);
        this.removeMeshes(this._points.points);
        this.addMeshes(this._points.generate(pointsVector));
    }
}
