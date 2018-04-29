import { Material, Geometry, BoxGeometry, Mesh } from "three";
import { TextureImportUtils } from "../utils/texture-import-utils";

const BOX_SIZE_X: number = 1000;
const BOX_SIZE_Y: number = 0.001;
const BOX_SIZE_Z: number = 1000;
const PLANE_GEOMETRY: Geometry = new BoxGeometry(BOX_SIZE_X, BOX_SIZE_Y, BOX_SIZE_Z);

const MOCK_MATERIAL_COLOR: number = 0xFFFFFF ;
const MOCK_PLANE_MATERIAL: Material = TextureImportUtils.createMaterialFromColor(MOCK_MATERIAL_COLOR);

export const PLANE_MESH: Mesh = new Mesh(PLANE_GEOMETRY, MOCK_PLANE_MATERIAL);

export const DRAGGED_OBJECT_HEIGHT: number = 0;
