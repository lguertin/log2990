import { Vector2, Shape, Material, Geometry, CylinderGeometry, BoxGeometry, SphereGeometry} from "three";
import { TextureImportUtils } from "../utils/texture-import-utils";

const TRACK_ASSET_PATH: string = "../../../assets/field/road.jpg";
const SEG_REPEAT: number = 0.08;
export const SEGMENT_TRACK_MATERIAL: Material = TextureImportUtils.importRepeatableMaterial(TRACK_ASSET_PATH, SEG_REPEAT, SEG_REPEAT);

const CYL_REPEAT: number = 2;
export const CYLINDER_TRACK_MATERIAL: Material = TextureImportUtils.importRepeatableMaterial(TRACK_ASSET_PATH, CYL_REPEAT, CYL_REPEAT);

const FLAG_ASSET_PATH: string = "../../../assets/field/flag.jpg";
export const FLAG_MATERIAL: Material = TextureImportUtils.importMaterial(FLAG_ASSET_PATH);

/* tslint:disable: no-magic-numbers*/
export const MIN_VALID_ANGLE: number = Math.PI / 4;

export const ROAD_WIDTH: number = 25;
export const ROAD_DEPTH: number = 0.01;
const ACCEPTABLE_LENGTH_WIDTH_RATIO: number = 2;
export const SEGMENT_MINIMUM_LENGTH: number = ROAD_WIDTH * ACCEPTABLE_LENGTH_WIDTH_RATIO;

export const FLAG_WIDTH: number = ROAD_WIDTH;
export const FLAG_DEPTH: number = ROAD_DEPTH * 2;
export const FLAG_DISTANCE: number = 3;

export const FLAG_GEOMETRY: Geometry = new BoxGeometry(FLAG_DISTANCE, FLAG_DEPTH, FLAG_WIDTH);

/*tslint:disable-next-line:no-magic-numbers Divided by 2 only to get half of the road width*/
export const HALF_ROAD_WIDTH: number = ROAD_WIDTH / 2;

const TRACK_EXTRUDED_SHAPE_POINTS: Vector2[] = [
    new Vector2(-ROAD_DEPTH, -HALF_ROAD_WIDTH),
    new Vector2(-ROAD_DEPTH, HALF_ROAD_WIDTH),
    new Vector2(ROAD_DEPTH, HALF_ROAD_WIDTH),
    new Vector2(ROAD_DEPTH, -HALF_ROAD_WIDTH)
];

export const SEGMENT_PATH_NUMBER_OF_STEPS: number = 1;
export const SEGMENT_PATH_BEVEL_ENABLED: boolean = false;

export const TRACK_EXTRUDED_SHAPE: Shape = new Shape(TRACK_EXTRUDED_SHAPE_POINTS);

export const INVALID_SEGMENT_MATERIAL: Material = TextureImportUtils.createMaterialFromColor(0xFF0000);

const CYLINDER_GEOMETRY_DETAIL: number = 32;
export const CYLINDER_GEOMETRY: Geometry = new CylinderGeometry(HALF_ROAD_WIDTH, HALF_ROAD_WIDTH, ROAD_DEPTH, CYLINDER_GEOMETRY_DETAIL);

const RADIUS: number = 5;
const PRECISION: number = 40;
export const POINT_GEOMETRY: Geometry = new SphereGeometry(RADIUS, PRECISION, PRECISION);

export const FIRST_POINT_MATERIAL: Material = TextureImportUtils.createMaterialFromColor(0x0000FF);

export const NEXT_POINT_MATERIAL: Material = TextureImportUtils.createMaterialFromColor(0x00FF00);
