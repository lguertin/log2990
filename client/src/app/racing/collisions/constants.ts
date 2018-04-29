export const CARS_COLLISION_ELASTICITY_CONSTANT: number = 1;

export const MAXIMUM_SPEED_OUTSIDE_TRACK: number = 15;
export const TRACK_COLLISION_SPEED_REDUCTION: number = 0.999;
export const MAX_TRACK_COLLISION_SPEED_REDUCTION: number = 0.95;
export const TRACK_COLLISION_ANGULAR_COEFF: number = 0.2;

export const MAX_TRACK_COLLISION_SPEED: number = 65;
export const MAX_CAR_COLLISION_SPEED: number = 20;

export const MINIMAL_CAR_SPEED_WHEN_COLLIDING: number = 4;
export const MAX_CAR_ANGULAR_COLLISION: number = 3;

export const CAR_CORNERS: boolean[][] = [
    [true, true],
    [true, false],
    [false, false],
    [false, true]
];
