import * as fs from 'fs';

export abstract class BaseChallenge {

    loadInput(file: string): string {
        try {
            return fs.readFileSync(file, 'utf8')
        } catch(err) {
            return ''
        }
    }

    abstract run(): void
}