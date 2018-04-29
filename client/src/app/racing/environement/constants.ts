export const SLAB_HEIGHT: number = 2;

export const IMAGES_POSITIONS: string[] = ["right", "left", "top", "bottom", "back", "front"];
export const EXTENSION: string = ".png";
export const DAY_ASSETS_PATH: string = "../../../assets/skybox/sand/";
export const NIGHT_ASSETS_PATH: string = "../../../assets/skybox/moon/";
export const DIRECTIONAL_LIGHT_INTENSITY: number = 1.2 ;
export const DIRECTIONAL_LIGHT_POSITIONX: number = 0;
export const DIRECTIONAL_LIGHT_POSITIONY: number = 2;
export const DIRECTIONAL_LIGHT_POSITIONZ: number = 1;
export const DIRECTIONAL_LIGHT_SIZE: number = 1000;
// tslint:disable-next-line:no-magic-numbers
export const DIRECTIONAL_LIGHT_HALFSIZE: number = 1000 / 2;
export const NUMBER_OF_CUBE_FACES: number = 6;
export const CUBE_SIZE: number  = 5000;
export const SHADOW_BIAS: number = -0.0001;
export const WHITE_COLOR: number = 0xFFFFFF;
export const BLUE_COLOR: number = 0x6C89BE;

export const enum Mode {
    DAY,
    NIGHT
}

export const GRASS_ASSET_PATH: string = "../../../assets/field/grass.jpg";
export const GRASS_REPEAT_SIZE: number = 100;
