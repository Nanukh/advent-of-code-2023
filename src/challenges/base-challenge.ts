import * as fs from 'fs';

export abstract class BaseChallenge {

    input: string = ''

    loadInput(file: string): void {
        try {
            this.input = fs.readFileSync(file, 'utf8')
        } catch(err) {
            console.error('Could not load ' + file)
        }
    }

    public abstract run(): void
    protected abstract partOne(): void
    protected abstract partTwo(): void
}