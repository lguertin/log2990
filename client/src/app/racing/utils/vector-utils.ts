import { Vector3 } from "three";
import { VERTICAL_AXIS } from "../constants";

export class VectorUtils {
    public static boundVector(vector: Vector3, maximumrepeatX: number): Vector3 {
        return vector.length() > maximumrepeatX ? vector.setLength(maximumrepeatX) : vector;
    }

    public static addVectorXZ(point: Vector3, position: Vector3): void {
        position.x += point.x ;
        position.z += point.z ;
    }

    public static copyVectorXZ(point: Vector3, position: Vector3): void {
        position.x = point.x;
        position.z = point.z;
    }
    public static copyVector(point: Vector3, position: Vector3): void {
        position.x = point.x;
        position.y = point.y;
        position.z = point.z;
    }

    public static rotateY90DegToRight(vector: Vector3): Vector3 {
        return vector.clone().cross(VERTICAL_AXIS);
    }

    public static vectorSum(...vectors: Vector3[]): Vector3 {
        const sum: Vector3 = new Vector3();

        for (const vector of vectors) {
            sum.add(vector);
        }

        return sum;
    }

    public static vectorMedium(...vectors: Vector3[]): Vector3 {
        return this.vectorSum(...vectors).divideScalar(vectors.length);
    }

    public static longestVector(...vectors: Vector3[]): Vector3 {
        let longest: Vector3 = vectors[0];

        for (const vector of vectors) {
            if (longest.lengthSq < vector.lengthSq) {
                longest = vector;
            }
        }

        return longest;
    }

    public static shortestVector(...vectors: Vector3[]): Vector3 {
        let shortest: Vector3 = vectors[0];

        for (const vector of vectors) {
            if (shortest.lengthSq > vector.lengthSq) {
                shortest = vector;
            }
        }

        return shortest;
    }

    private static compareLengths(a: Vector3, b: Vector3): number {
        return a.lengthSq() - b.lengthSq();
    }

    public static sortToClosest(vectors: Vector3[], origin: Vector3): Vector3[] {

        for (const corner of vectors) {
            corner.sub(origin);
        }

        vectors.sort(this.compareLengths);

        for (const corner of vectors) {
            corner.add(origin);
        }

        return vectors;
    }

    public static getXZAngle( direction: Vector3): number {
        return Math.atan(direction.x / direction.z) + (direction.z < 0 ? Math.PI : 0);
    }
}
