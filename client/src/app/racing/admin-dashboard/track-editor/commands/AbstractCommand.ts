import { Points } from "../../../track/points";
import { Track } from "../../../track/track";
import { Scene, Mesh } from "three";
import { MouseRaycaster } from "../../../mouseRaycaster/mouseRaycaster";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";
import { RenderCamera } from "../../../rendering/camera/renderCamera";

export abstract class AbstractCommand {
    protected _points: Points;
    protected _mouseRaycaster: MouseRaycaster;
    protected _track: Track;
    protected _scene: Scene;
    protected _camera: RenderCamera;

    public constructor(editor: EditorRendererService) {
        this._scene = editor._scene;
        this._points = editor.points;
        this._track = editor.track;
        this._camera = editor.camera;
        this._mouseRaycaster = editor.raycaster;
    }

    public abstract execute(event: MouseEvent): void ;

    public removeSphere(): void {
        this.removeMesh(this._points.removeLastPoint());
    }

    protected removeMesh(mesh: Mesh): void {
        this._scene.remove(mesh);
    }

    protected removeMeshes(meshes: Mesh[]): void {
        for (const mesh of meshes) {
            this._scene.remove(mesh);
        }
    }

    protected addMeshes(meshes: Mesh[]): void {
        for (const mesh of meshes) {
            this._scene.add(mesh);
        }
    }
}
