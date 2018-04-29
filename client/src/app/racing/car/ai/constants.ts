import { ROAD_WIDTH } from "../../track/constants";

export const MIN_AI_SPEED: number = 30;
export const MAX_AI_SPEED: number = 65;
export const STEERING_MARGIN_OF_ERROR: number = 0.04;
export const MAX_ADJUSTMENT_DISTANCE_FROM_TURN: number = 30;
export const MAX_DISTANCE_WITH_DISPLACEMENT_ATTENUATION: number = 20;
export const ADJUSTMENT_DISTANCE_FACTOR: number = 0.4;
const ROAD_SIDE_MARGIN: number = 3;
export const MAX_LATERAL_ADJUSTMENT_BEFORE_TURN: number = ROAD_WIDTH / 2 - ROAD_SIDE_MARGIN;
export const MAX_LATERAL_ADJUSTMENT_AT_TURN: number = ROAD_WIDTH - ROAD_SIDE_MARGIN;

/* tslint:disable:no-magic-numbers */// Radian angles
export const MIN_ANGLE: number = Math.PI / 4;
export const MAX_ANGLE: number = Math.PI;

export const MAX_SLOW_DOWN_TURN_ANGLE: number = Math.PI * 3 / 4;

export const MIN_LATERAL_DISPLACEMENT_ANGLE_AT_TURN: number = Math.PI / 3;
export const MAX_LATERAL_DISPLACEMENT_ANGLE_AT_TURN: number = MAX_ANGLE;

export const MIN_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN: number = Math.PI / 2;
export const MAX_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN: number = Math.PI * 5 / 6;
/* tslint:enable:no-magic-numbers */

export const MIN_CAR_DISTANCE: number = 10;

export const WAYPOINT_DISTANCE_FROM_POINT: number = 35;

export const TURN_ANGLE_MARGIN: number = 0.01;

export enum SteeringAdjustment {
    Left,
    Right,
    None
}

export enum SpeedAdjustment {
    Brake,
    SlowDown,
    SpeedUp,
    None
}
