import { BaseChallenge } from './base-challenge.js'
import { addStringAt } from '../utils.js'

/**
 * https://adventofcode.com/2023/day/11
 * 
 * _Expand your ~mind~ universe, OMORI!_ (✿＾◡＾)
 */
export default class CosmicExpansion extends BaseChallenge {

    public run(): void {
        this.loadInput('src/assets/11-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY TEN: Pipe Maze`)
        console.log('________________________\n')
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Expands the universe according to the given rules, then calculates the Manhattan distance between each galaxy pair.
     */
    protected partOne(): void {
        let expandedUniverse: string[] = []
        const expandedGalaxies: number[][] = []
        const galaxyRgx: RegExp = new RegExp(/#/g)

        // Expand
        const lines = this.input.split('\n').filter(l => l)
        lines.forEach((line, y) => {
            expandedUniverse.push(line)
            const matches = Array.from(line.matchAll(galaxyRgx))
            if (matches.length === 0) {
                expandedUniverse.push(line)
            }
        })
        for (let c = 0; c < expandedUniverse[0].length; c++) {
            const col: string[] = expandedUniverse.map(l => l[c])
            if (!col.includes('#')) {
                expandedUniverse = expandedUniverse.map(l => addStringAt(l, c, '.'))
                c++
            }
        }

        // Fetch expanded galaxies
        for (let r = 0; r < expandedUniverse.length; r++) {
            const row: string = expandedUniverse[r]
            const matches = Array.from(row.matchAll(galaxyRgx))
            if (matches.length > 0) {
                expandedGalaxies.push(...matches.map((m: RegExpMatchArray) => ([m.index!, r])))
            }
        }

        // Calculate paths
        let total = 0
        for (let g = 0; g < expandedGalaxies.length; g++) {
            const curGalaxy = expandedGalaxies[g]
            for (let gPair = g + 1; gPair < expandedGalaxies.length; gPair++) {
                const pairedGalaxy = expandedGalaxies[gPair]
                total += Math.abs(curGalaxy[0] - pairedGalaxy[0]) + Math.abs(curGalaxy[1] - pairedGalaxy[1])
            }
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Same as part one, but instead uses the number of traversed empty columns/rows to calculate
     * the total Manhattan distance, based on the given expansion factor per column/row.
     */
    protected partTwo(): void {
        const startingEmptyRows: number[] = []
        const startingEmptyColumns: number[] = []
        const startingGalaxies: number[][] = []

        const galaxyRgx: RegExp = new RegExp(/#/g)
        const lines = this.input.split('\n').filter(l => l)
        lines.forEach((line, y) => {
            const matches = Array.from(line.matchAll(galaxyRgx))
            if (matches.length === 0) {
                startingEmptyRows.push(y)
            } else {
                startingGalaxies.push(...matches.map((m: RegExpMatchArray) => ([m.index!, y])))
            }
        })
        for (let c = 0; c < lines[0].length; c++) {
            const col: string[] = lines.map(l => l[c])
            if (!col.includes('#')) {
                startingEmptyColumns.push(c)
            }
        }

        let total = 0
        for (let g = 0; g < startingGalaxies.length - 1; g++) {
            const curGalaxy = startingGalaxies[g]
            for (let gPair = g + 1; gPair < startingGalaxies.length; gPair++) {
                const pairedGalaxy = startingGalaxies[gPair]

                const traversedEmptyY = startingEmptyRows.filter((y) => y > Math.min(curGalaxy[1], pairedGalaxy[1]) && y < Math.max(curGalaxy[1], pairedGalaxy[1]))
                const traversedEmptyX = startingEmptyColumns.filter((x) => x > Math.min(curGalaxy[0], pairedGalaxy[0]) && x < Math.max(curGalaxy[0], pairedGalaxy[0]))
                const diffX = Math.abs(curGalaxy[0] - pairedGalaxy[0]) + ((1e6-1) * traversedEmptyX.length)
                const diffY = Math.abs(curGalaxy[1] - pairedGalaxy[1]) + ((1e6-1) * traversedEmptyY.length)
                total += diffX + diffY
            }
        }
        console.log('* (Part 1) Answer: ' + total)
    }
    
}