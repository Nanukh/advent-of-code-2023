import { BaseChallenge } from "./base-challenge.js";

export class DayTwo extends BaseChallenge {

    static inputs: string[] = []

    static override run(): void {
        console.log('\nDAY TWO: ')
        console.log('---------------------------------------')
        this.inputs.push(this.loadInput('src/assets/day-two-input.txt'))
        this.partOne()
        this.partTwo()
    }

    private static partOne(): void {
        console.log('* (Part 1) Answer: ')
    }

    private static partTwo(): void {
        console.log('* (Part 2) Answer: ')
    }
}