
export class ArrayUtils {

    private static randomIndex(array: {}[]): number {
        return Math.floor(Math.random() * array.length);
    }

    public static randomElement<T>(array: T[]): T {
        return array[this.randomIndex(array)];
    }

    public static init2DArray<T>(rows: number, cols: number, value: T): T[][] {
        const array2D: T[][] = [];

        for ( let i: number = 0; i < rows ; i++ ) {
            array2D[i] = [];

            for ( let j: number = 0; j < cols; j++) {
                array2D[i][j] = value;
            }
        }

        return array2D ;
    }
}
