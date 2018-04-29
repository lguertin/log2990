import { CameraCommand } from "./cameraCommand";
import { CameraManager } from "../../rendering/camera/cameraManager";

export class ZoomInKey extends CameraCommand {

    public constructor(cameraManager: CameraManager) {
        super(cameraManager);
    }

    public executeDown(): void {
        this.cameraManager.activeCamera.isZoomingIn = true;
    }

    public executeUp(): void {
        this.cameraManager.activeCamera.isZoomingIn = false;
    }
}

export class ZoomOutKey extends CameraCommand {

    public constructor(cameraManager: CameraManager) {
        super(cameraManager);
    }

    public executeDown(): void {
        this.cameraManager.activeCamera.isZoomingOut = true;
    }

    public executeUp(): void {
        this.cameraManager.activeCamera.isZoomingOut = false;
    }
}
