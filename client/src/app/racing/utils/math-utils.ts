
export class MathUtils {
    public static isEven(n: number): boolean {
        return n % 2 === 0 ;
    }

    public static sum(...numbers: number[]): number {
        let sum: number = 0;

        for (const n of numbers) {
            sum += n;
        }

        return sum;
    }

    public static average(...numbers: number[]): number {
        return this.sum(...numbers) / numbers.length;
    }

    public static interpolate(min: number, max: number, factor: number): number {
        return min + factor * ( max - min );
    }

    public static boundValue(min: number, max: number, value: number): number {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }

    public static marginSign(value: number, margin: number): number {
        return Math.abs(value) > Math.abs(margin) ? Math.sign(value) : 0;
    }

    public static quadraticSolve(a: number, b: number, c: number): number[] {
        /* tslint:disable:no-magic-numbers */// Quadratic formula
        const sqrt: number = Math.sqrt(a * c * 4 - b * b);

        return [(-b - sqrt) / (a * 2), (-b + sqrt) / (a * 2)];
        /* tslint:enable:no-magic-numbers */
    }
}
