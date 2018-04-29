import { CameraManager } from "../../rendering/camera/cameraManager";
import { CameraCommand } from "./cameraCommand";

export class ChangeCameraKey extends CameraCommand {

    public constructor(cameraManager: CameraManager) {
        super(cameraManager);
    }

    public executeDown(): void {
        this.cameraManager.switchCamera();
    }

    public executeUp(): void {
    }
}
