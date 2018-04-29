import { Vector2, Vector3, Box3 } from "three";
import { TopDownCamera } from "./camera/topDownCamera";
import { Track } from "../track/track";
import { TRACK_BOUNDS_TO_CAMERA } from "./constants";
import { VectorUtils } from "../utils/vector-utils";

export class ScreenshotManager {

    public constructor(private camera: TopDownCamera, private track: Track) {}

    public positionnateScreenShotCamera(): void {
        this.updateScreenShotPosition();
        this.updateScreenShotAspectRatio(this.requiredAspectRatio);
    }

    private get neededScreenShotPosition(): Vector3 {
        const box: Box3 = this.track.bounds;

        return new Vector3(box.getCenter().x, 0, box.getCenter().z);
    }

    private updateScreenShotPosition(): void {
        VectorUtils.copyVectorXZ(this.neededScreenShotPosition, this.camera.position);
    }

    private get currentAspect(): Vector2 {
        return new Vector2(this.camera.width, this.camera.height);
    }

    private getAspectFromBoxSize(boxSize: Vector3): Vector2 {
        return new Vector2(boxSize.x, boxSize.z);
    }

    private get trackAspect(): Vector2 {
        return this.getAspectFromBoxSize(this.track.bounds.getSize());
    }

    private boundToRatio(aspectRatio: Vector2, ratio: number): void {
        if (ratio > 1) {
            aspectRatio.multiplyScalar(ratio);
        }
    }

    private get requiredAspectRatio(): Vector2 {
        const currentAspectRatio: Vector2 = this.currentAspect;
        const trackAspectRatio: Vector2 = this.trackAspect;

        trackAspectRatio.multiplyScalar(TRACK_BOUNDS_TO_CAMERA);

        this.boundToRatio(currentAspectRatio, trackAspectRatio.x / currentAspectRatio.x);
        this.boundToRatio(currentAspectRatio, trackAspectRatio.y / currentAspectRatio.y);

        return  currentAspectRatio;
    }

    private updateScreenShotAspectRatio(aspectRatio: Vector2): void {
        this.camera.updateAspectRatio(aspectRatio.x, aspectRatio.y);
    }
}
