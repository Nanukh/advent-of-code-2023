import { BaseChallenge } from './base-challenge.js'

/**
 * https://adventofcode.com/2023/day/9
 */
export default class MirageMaintenance extends BaseChallenge {

    numberArrs: number[][] = []

    public run(): void {
        this.loadInput('src/assets/09-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY NINE: Mirage Maintenance`)
        console.log('__________________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Setup function.\
     * Simply converts each line of the input into an array of numbers.
     */
    private setup(): void {
        const lines = this.input.split('\n').filter(l => l)
        const numberRgx = new RegExp(/[-0-9]{1,}/g)
        this.numberArrs = lines.map(line =>
            Array.from(line.match(numberRgx)!.map(m => parseInt(m)))
        )
    }

    /**
     * See {@link extrapolateNextNumber}
     */
    protected partOne(): void {
        let total = 0
        for(let nArr of this.numberArrs) {
            total += this.extrapolateNextNumber(nArr)
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Reverses the initial arrays then does the same, lmao
     * 
     * See {@link extrapolateNextNumber}
     */
    protected partTwo(): void {
        let total = 0
        const reversedNumberArrs = this.numberArrs.slice().map(arr => arr.reverse())
        for(let nArr of reversedNumberArrs) {
            total += this.extrapolateNextNumber(nArr)
        }
        console.log('* (Part 2) Answer: ' + total)
    }

    /**
     * For a given array of numbers, extrapolates the next value using polynomial interpolation / number series reasoning.
     * 
     * See https://adventofcode.com/2023/day/9 for the full explanation.
     * @param arr 
     * @returns 
     */
    private extrapolateNextNumber(arr: number[]) {
        let extrapolationSteps: number[][] = [arr]
        for(let step = 1; step < arr.length - 1; step++) {
            const prevStep = extrapolationSteps[step - 1]
            const newStep = prevStep.map((e, i) => i >= 1 ? e - prevStep[i-1] : Number.EPSILON).slice(1)
            extrapolationSteps.push(newStep)

            if (extrapolationSteps.at(-1)!.every((e, _, arr) => e === arr[0])) break
        }

        extrapolationSteps.at(-1)!.push(extrapolationSteps.at(-1)![0])
        for (let step = extrapolationSteps.length - 1; step > 0; step--) {
            const curStep = extrapolationSteps[step]
            const nextStep = extrapolationSteps[step - 1]
            nextStep.push(nextStep[nextStep.length - 1] + curStep[curStep.length - 1])
        }
        return extrapolationSteps[0].at(-1)!
    }
}