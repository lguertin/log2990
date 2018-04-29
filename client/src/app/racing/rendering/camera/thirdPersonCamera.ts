import { RenderCamera, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "./renderCamera";
import { PerspectiveCamera, Vector3 } from "three";
import { Followable } from "../../followable";
import { VectorUtils } from "../../utils/vector-utils";

export const THIRD_PERSON_CAMERA_DISTANCE: number = -5;
export const THIRD_PERSON_CAMERA_HEIGHT: number = 2;
const FIELD_OF_VIEW: number = 70;
const ZOOM_SPEED: number = 0.001;
const MAX_ZOOM_FACTOR: number = 0.55;
const MIN_ZOOM_FACTOR: number = 1.8;

export class ThirdPersonCamera extends PerspectiveCamera implements RenderCamera {
    public isZoomingIn: boolean;
    public isZoomingOut: boolean;
    private _zoomFactor: number;

    public constructor(name: string, width: number, height: number) {
        super(FIELD_OF_VIEW, width / height, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = name;
        this._zoomFactor = 1;
        this.isZoomingIn = false;
        this.isZoomingOut = false;
    }

    public updateAspectRatio(width: number, height: number): void {
        this.aspect = width / height;
        this.updateProjectionMatrix();
    }

    private updateZoom(deltaTime: number): void {
        if (this.isZoomingIn && !this.isZoomingOut) {
            this.zoomIn(deltaTime);
        } else if (this.isZoomingOut && !this.isZoomingIn) {
            this.zoomOut(deltaTime);
        }
    }

    private get zoomDistance(): number {
        return THIRD_PERSON_CAMERA_DISTANCE * this._zoomFactor;
    }

    private get heightOffsetAmplitude(): number {
        return THIRD_PERSON_CAMERA_HEIGHT * this._zoomFactor;
    }

    private get heightOffset(): Vector3 {
        return new Vector3(0, this.heightOffsetAmplitude, 0);
    }

    private getCameraRelativePosition(reference: Followable): Vector3 {
        return reference.getDirection()
                .multiplyScalar(this.zoomDistance)
                .add(this.heightOffset);
    }

    private getRequiredCameraPosition(reference: Followable): Vector3 {
        return reference.getPosition().add(this.getCameraRelativePosition(reference));
    }

    public update(deltaTime: number, reference: Followable): void {
        this.updateZoom(deltaTime);
        VectorUtils.copyVector(this.getRequiredCameraPosition(reference), this.position);
        this.lookAt(reference.getPosition());
    }

    public setZoom(amount: number): void {
        this._zoomFactor = amount;
    }

    private zoomIn(deltaTime: number): void {
        this._zoomFactor -= deltaTime * ZOOM_SPEED;
        this._zoomFactor = Math.max(this._zoomFactor, MAX_ZOOM_FACTOR);
    }

    private zoomOut(deltaTime: number): void {
        this._zoomFactor += deltaTime * ZOOM_SPEED;
        this._zoomFactor = Math.min(this._zoomFactor, MIN_ZOOM_FACTOR);
    }
}
