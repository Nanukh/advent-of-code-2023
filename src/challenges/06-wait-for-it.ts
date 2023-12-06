import { BaseChallenge } from "./base-challenge.js";

/**
 * https://adventofcode.com/2023/day/6
 */
export default class WaitForIt extends BaseChallenge {
    
    races: number[][] = []

    public run(): void {
        this.loadInput('src/assets/06-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY SIX: Wait For It`)
        console.log('_______________________________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Setup function.\
     * Stores the input as an array of number pairs (time, distance).
     */
    private setup(): void {
        const numberRgx: RegExp = new RegExp(/\d{1,}/g)
        let lines: string[] = this.input.split('\n').filter(l => l)

        const timeMatches = lines[0].match(numberRgx)
        const distanceMatches = lines[1].match(numberRgx)
        if (!timeMatches || !distanceMatches) return
        
        for (let i = 0; i < timeMatches.length; i++) {
            this.races.push([parseInt(timeMatches[i]), parseInt(distanceMatches[i])])
        }
    }

    /**
     * Simply iterates on each race, calculates the total distance relative to the hold time, and adds to the race total if we beat the record
     */
    protected partOne(): void {
        let total = 0
        for (let r = 0; r < this.races.length; r++) {
            let raceTotal = 0
            for (let holdTime = 1; holdTime < this.races[r][0] - 1; holdTime++) {
                const distance = holdTime * (this.races[r][0] - holdTime)
                if (distance <= this.races[r][1]) continue
                raceTotal++
            }
            if (total === 0) total = raceTotal
            else total *= raceTotal
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Re-parses the input to get the correct time & distance, then does the same as before
     */
    protected partTwo(): void {
        let raceTimeStr = '', raceRecordStr = ''
        this.races.forEach(r => {
            raceTimeStr += r[0] + ''
            raceRecordStr += r[1] + ''
        })
        const raceTime = parseInt(raceTimeStr)
        const raceRecord = parseInt(raceRecordStr)

        let total = 0
        for (let holdTime = 1; holdTime < raceTime - 1; holdTime++) {
            const distance = holdTime * (raceTime - holdTime)
            if (distance <= raceRecord) continue
            total++
        }
        console.log('* (Part 2) Answer: ' + total)
    }

}