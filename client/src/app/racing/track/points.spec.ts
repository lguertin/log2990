import { Points } from "./points";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers */

describe("Points", () => {
    let points: Points ;

    beforeEach( () => {
        points = new Points();
    });

    it("should be instantiable using default constructor", () => {
        expect(points).toBeDefined();
    });

    it("should have a length of 1 at initialisation", () => {
        expect(points.points.length).toBe(1);
    });

    it("should have a length of 11 when 10 coordinates are added", () => {
        for (let i: number = 1 ; i <= 10 ; i++) {
            points.addNewPoint( new Vector3(i, i, i) );
        }

        expect(points.points.length).toBe(11);
    });

    it("should return the last element added when the lastPoint attribute is called and should keep the same size", () => {

        for (let i: number = 1 ; i <= 10 ; i++) {
            points.addNewPoint( new Vector3(i, i, i) );
        }

        const vec: Vector3 = new Vector3(30, 30, 30);
        points.addNewPoint(vec);

        const currentSize: number = points.points.length ;
        expect(points.lastPoint.position).toEqual(vec);
        expect(points.points.length).toBe(currentSize);
    });

    it("should return the last element added when the removeLastPoint is called and should have a size reduced by 1 element", () => {

        for (let i: number = 1 ; i <= 10 ; i++) {
            points.addNewPoint( new Vector3(i, i, i) );
        }

        const vec: Vector3 = new Vector3(30, 30, 30);
        points.addNewPoint(vec);

        const currentSize: number = points.points.length ;
        expect(points.removeLastPoint().position).toEqual(vec);
        expect(points.points.length).toBe(currentSize - 1);
    });

    it("should return the right index for every element inside of points", () => {

        for (let i: number = 1 ; i <= 10 ; i++) {
            points.addNewPoint( new Vector3(i, i, i) );
        }

        for (let i: number = 0 ; i < points.points.length; i++) {
            expect(points.getIndex(points.points[i])).toBe(i);
        }
    });

    it("should return a -1 index if the element doesn't exist anymore in points", () => {
        for (let i: number = 0 ; i < 10 ; i++) {
            points.addNewPoint(new Vector3(i, i, i));
        }

        expect(points.getIndex(points.removeLastPoint())).toBe(-1);
    });
});
