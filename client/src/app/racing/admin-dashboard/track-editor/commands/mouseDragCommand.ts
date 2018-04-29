import { Vector3, Object3D } from "three";
import { AbstractCommand } from "./AbstractCommand";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";

export class MouseDragCommand extends AbstractCommand {

    public constructor(editor: EditorRendererService) {
        super(editor);
    }

    public execute(event: MouseEvent): void {
        const elem: Object3D = this._mouseRaycaster.drag(event, this._camera);

        if (elem !== undefined) {
            this.moveTrackPoint(elem.position, this._points.getIndex(elem));
        }
    }

    private moveTrackPoint(position: Vector3, index: number): void {
        this.removeMeshes(this._track.removeMovedSegments(index));
        this.addMeshes(this._track.addMovedSegments(position));
    }
}
