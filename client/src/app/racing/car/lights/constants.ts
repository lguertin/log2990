import { Color } from "three";

export const enum LightPosition {
    Left = 1,
    Right = -1
}

export const INITIAL_NIGHT_LIGHT_MODE: boolean = false ;

export const SHADOW_CAMERA_NEAR: number = 500;
export const SHADOW_CAMERA_FAR: number = 4000;
export const SHADOW_CAMERA_FOV: number = 500;

export const FRONT_SHOW_DISTANCE: number = 50;
export const FRONT_ANGLE: number = 0.4;
export const FRONT_BASE_INTENSITY: number = 5;
export const FRONT_COLOR: Color = new Color(1, 1, 1);
export const FRONT_HEIGHT_OFFSET: number = 0.44;
export const FRONT_DISTANCE: number = 0.6;
export const FRONT_PENUMBRA: number = 0.2;
export const FRONT_DECAY: number = 2;

export const BACK_SHOW_DISTANCE: number = 1;
export const BACK_COLOR: Color = new Color(1, 0, 0);
export const BACK_Y_ADDITION: number = 0.6;
export const BACK_BOOL_MULTIPLIER: number = 1;
export const BACK_DISTANCE: number = 1.52;
export const BACK_SEPARATE_DISTANCE: number = 0.25;
