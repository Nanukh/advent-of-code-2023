import { BaseChallenge } from "./base-challenge.js";

/**
 * https://adventofcode.com/2023/day/1
 */
export default class Trebuchet extends BaseChallenge {

    run(): void {
        this.loadInput('src/assets/01-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY ONE: Trebuchet?!`)
        console.log('__________________________\n')
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Uses a simple regex to extract digits from the input
     */
    protected partOne(): void {
        const letterStripRgx: RegExp = new RegExp(/\D+/g)

        let total = 0
        let calibrationStrings: string[] = this.input.split('\n')
        for (const str of calibrationStrings) {
            const arr: string[] = str.replace(letterStripRgx, '').split('').filter(i => i)
            if (arr.length === 0) continue
            total += parseInt(`${arr[0]}${arr[arr.length - 1]}`)
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Uses a conditional multiple-match lookahead regex to extract number-words and digits, regardless of token ordering
     * 
     * Note: works thanks to https://stackoverflow.com/a/33903830
     */
    protected partTwo(): void {
        const numberStrs: Map<string, number> = new Map<string, number>([['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5], ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9]])
        const numberWords = [...numberStrs.keys()]
        const digitsRgx = new RegExp(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g)

        let total = 0
        let calibrationStrings: string[] = this.input.split('\n')
        for (let str of calibrationStrings) {
            const matches: string[] = Array.from(str.matchAll(digitsRgx), x => x[1])
            if (!matches) continue
            
            const digits = matches?.map(d => numberWords.includes(d) ? numberStrs.get(d)?.toString() : d)
            if (digits.length === 0) continue
            total += parseInt(`${digits[0]}${digits[digits.length - 1]}`)
        }
        console.log('* (Part 2) Answer: ' + total)
    }
}