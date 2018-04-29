import { RenderCamera } from "./renderCamera";
import { Followable } from "../../followable";

export class CameraManager {
    private _cameras: RenderCamera[];
    private _activeCamera: RenderCamera;

    public constructor() {
        this._cameras = [];
    }

    private get numberOfCameras(): number {
        return this._cameras.length;
    }

    private setFirstActiveCamera(): void {
        if (this.numberOfCameras === 1) {
            this._activeCamera = this._cameras[0];
        }
    }

    public addCamera(camera: RenderCamera): void {
        this._cameras.push(camera);
        this.setFirstActiveCamera();
    }

    public get activeCamera(): RenderCamera {
        return this._activeCamera;
    }

    public get activeCameraName(): string {
        return this.activeCamera.name;
    }

    public updateCamera(deltaTime: number, ref: Followable): void {
        this._activeCamera.update(deltaTime, ref);
    }

    public get activeCameraIndex(): number {
        for (let i: number = 0; i < this._cameras.length; i++) {
            if (this._cameras[i] === this._activeCamera) {
                return i;
            }
        }

        return -1;
    }

    public getNextCameraIndex(index: number): number {
        return (index + 1) % this.numberOfCameras;
    }

    public switchCamera(): void {
        this._activeCamera = this._cameras[this.getNextCameraIndex(this.activeCameraIndex)];
    }

    public updateContainerSize(width: number, height: number): void {
        for (const camera of this._cameras) {
            camera.updateAspectRatio(width, height);
        }
    }
}
