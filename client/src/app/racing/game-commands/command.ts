export abstract class Command {
    public abstract executeDown(): void;
    public abstract executeUp(): void;
}

class EmptyCommand extends Command {
    public executeDown(): void {}
    public executeUp(): void {}
}

export const EMPTY_COMMAND: Command = new EmptyCommand();
