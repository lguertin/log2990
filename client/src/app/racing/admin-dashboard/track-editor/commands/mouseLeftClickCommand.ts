import { AbstractCommand } from "./AbstractCommand";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";
import { Object3D, Mesh } from "three";

export class MouseLeftClickCommand extends AbstractCommand {
    public constructor(editor: EditorRendererService) {
        super(editor);
    }

    public execute(event: MouseEvent): void {
        const elem: Object3D = this._mouseRaycaster.findClickedObject(event, this._camera, this._points.points);
        if (!this._track.isLooping()) {
            if (!elem) {
                this.addSphere(event);
            }
            this.addMeshes(this._track.createSegment(elem, this._points));
        }
    }

    public addSphere(event: MouseEvent): void {
        this._points.addNewPoint(this._mouseRaycaster.getSurfacePoint(event, this._camera));
        this.addMesh(this._points.lastPoint);
    }

    protected addMesh(mesh: Mesh): void {
        this._scene.add(mesh);
    }
}
