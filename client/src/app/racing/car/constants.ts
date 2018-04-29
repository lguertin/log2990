import {Geometry, BoxGeometry } from "three";

export const INITIAL_POSITION_PARALLEL_DISTANCE: number = 8;
export const INITIAL_POSITION_LATERAL_DISTANCE: number = 4;
export const PLAYER_CAR_SPOT: number = 0;
export const NUMBER_OF_CARS: number = 4;
export const CAMERO_PATH: string = "../../assets/camero/camero.json";
export const AVENTADOR_PATH: string = "../../assets/aventador/aventador.json";

export const CAR_BOX_LENGTH: number = 3.1;
export const CAR_BOX_WIDTH: number = 1.3;
export const CAR_BOX_HEIGHT: number = 1;
export const CAR_BOX_GEOMETRY: Geometry = new BoxGeometry(CAR_BOX_WIDTH, CAR_BOX_HEIGHT, CAR_BOX_LENGTH);
