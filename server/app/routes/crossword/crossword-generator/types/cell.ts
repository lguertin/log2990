export class Cell {

    private usedCounter: number;
    constructor(private i: number, private j: number, private letter: string) {
        this.usedCounter  = 0 ;
    }

    public getI(): number {
        return this.i;
    }
    public getJ(): number {
        return this.j;
    }

    public getUsedCounter(): number {
        return this.usedCounter;
    }

    public increaseUsedCounter(): void {
        this.usedCounter++;
    }

    public decreaseUsedCounter(): void {
        this.usedCounter--;
    }

    public getLetter(): string {
        return this.letter;
    }

    public setLetter(letter: string): void {
        this.letter = letter;
    }
}
