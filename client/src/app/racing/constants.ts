import { Vector3, Material, MeshLambertMaterial } from "three";

export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
export const PI_OVER_2: number = Math.PI / 2;

export const VERTICAL_AXIS: Vector3 = new Vector3(0, 1, 0);

export const TRANSPARENT_MATERIAL: Material = new MeshLambertMaterial({transparent: true, opacity: 0});

export const MS_TO_SECOND: number = 1000;
