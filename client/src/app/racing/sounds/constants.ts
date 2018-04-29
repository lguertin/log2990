export enum SoundEvents {
    RACE_START,
    ENGINE,
    CAR_COLLISION_CAR,
    CAR_COLLISION_WALL,
}

export const RACE_START_SOUND_PATH: string = "../../../assets/sounds/race-start.ogg";
export const CAR_COLLISION_CAR_SOUND_PATH: string = "../../../assets/sounds/car-car-crash.ogg";
export const CAR_COLLISION_WALL_SOUND_PATH: string = "../../../assets/sounds/car-wall-crash.ogg";
export const CAR_ENGINE_SOUND_PATH: string = "../../../assets/sounds/car-engine.ogg";

export const MIN_COLLISION_SOUND_VOLUME: number = 0.25;
export const COLLISION_SOUND_VOLUME: number = 0.9;
export const ENGINE_SOUND_VOLUME: number = 0.4;
export const RACE_START_SOUND_VOLUME: number = 0.7;

export const RPM_SOUND_DIVIDER: number = 4000;
export const RPM_SOUND_ADDER: number = 0.4;
