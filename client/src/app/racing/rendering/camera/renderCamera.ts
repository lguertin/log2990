import { Followable } from "../../followable";
import { Camera } from "three";

export const FAR_CLIPPING_PLANE: number = 5000;
export const NEAR_CLIPPING_PLANE: number = 1;

export abstract class RenderCamera extends Camera {
    public isZoomingIn: boolean;
    public isZoomingOut: boolean;

    public abstract updateAspectRatio(width: number, height: number): void;
    public abstract update(deltaTime: number, reference: Followable): void;
    public abstract setZoom(amount: number): void;
}
