import { BaseChallenge } from "./base-challenge.js";

/**
 * https://adventofcode.com/2023/day/2
 */
export default class CubeConundrum extends BaseChallenge {

    run(): void {
        this.loadInput('src/assets/02-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY TWO: Cube Conundrum`)
        console.log('_____________________________\n')
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Uses separate regexes to match a digit with the associated color, then keeps possible games only based on the digit value
     */
    protected partOne(): void {
        const redRgx: RegExp = new RegExp(/(\d+) red/g)
        const greenRgx: RegExp = new RegExp(/(\d+) green/g)
        const blueRgx: RegExp = new RegExp(/(\d+) blue/g)

        let total: number = 0
        let gameStrings: string[] = this.input.split('\n')
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

    /**
     * Same as above, but simply calculates the power of the smallest possible set of cubes for each game
     */
    protected partTwo(): void {
        const redRgx: RegExp = new RegExp(/(\d+) red/g)
        const greenRgx: RegExp = new RegExp(/(\d+) green/g)
        const blueRgx: RegExp = new RegExp(/(\d+) blue/g)

        let total: number = 0
        let gameStrings: string[] = this.input.split('\n')
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