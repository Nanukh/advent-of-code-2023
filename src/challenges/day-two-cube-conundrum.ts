import { BaseChallenge } from "./base-challenge.js";

export class DayTwoCubeConundrum extends BaseChallenge {

    static inputs: string[] = []

    static override run(): void {
        console.log('\nDAY TWO: Cube Conundrum')
        console.log('---------------------------------------')
        this.inputs.push(this.loadInput('src/assets/day-two-input.txt'))
        this.partOne()
        this.partTwo()
        this.inputs.length = 0
    }

    private static partOne(): void {
        const redRgx: RegExp = new RegExp(/(\d+) red/g)
        const greenRgx: RegExp = new RegExp(/(\d+) green/g)
        const blueRgx: RegExp = new RegExp(/(\d+) blue/g)

        let total: number = 0
        let gameStrings: string[] = this.inputs[0].split('\n')
        gameStrings.pop()
        for (const str of gameStrings) {
            const gameIdStr = str.split(':')[0].replace('Game ', '')

            const redSet = str.match(redRgx)?.map(m => parseInt(m.split(' ')[0]))
            const greenSet = str.match(greenRgx)?.map(m => parseInt(m.split(' ')[0]))
            const blueSet = str.match(blueRgx)?.map(m => parseInt(m.split(' ')[0]))

            if (redSet && Math.max(...redSet) > 12) continue
            if (greenSet && Math.max(...greenSet) > 13) continue
            if (blueSet && Math.max(...blueSet) > 14) continue
            total += parseInt(gameIdStr)
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    private static partTwo(): void {
        const redRgx: RegExp = new RegExp(/(\d+) red/g)
        const greenRgx: RegExp = new RegExp(/(\d+) green/g)
        const blueRgx: RegExp = new RegExp(/(\d+) blue/g)

        let total: number = 0
        let gameStrings: string[] = this.inputs[0].split('\n')
        gameStrings.pop()
        for (const str of gameStrings) {
            const redSet = str.match(redRgx)?.map(m => parseInt(m.split(' ')[0]))
            const greenSet = str.match(greenRgx)?.map(m => parseInt(m.split(' ')[0]))
            const blueSet = str.match(blueRgx)?.map(m => parseInt(m.split(' ')[0]))

            total += Math.max(...redSet ?? []) * Math.max(...greenSet ?? []) * Math.max(...blueSet ?? [])
        }
        console.log('* (Part 2) Answer: ' + total)
    }
}