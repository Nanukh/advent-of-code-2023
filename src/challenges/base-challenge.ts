import * as fs from 'fs';

export class BaseChallenge {

    static loadInput(file: string): string {
        return fs.readFileSync(file, 'utf8')
    }

    static run(): void {
        throw new Error("Method not implemented")
    }
}