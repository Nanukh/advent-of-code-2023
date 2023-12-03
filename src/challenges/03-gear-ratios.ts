import { BaseChallenge } from "./base-challenge.js";
import { replaceStringAt } from '../utils.js'

/**
 * https://adventofcode.com/2023/day/3
 */
export default class GearRatios extends BaseChallenge {

    inputs: String[] = []
    lines: string[] = []

    refGrid: GridNumber[][] = []
    dimensions: Rect = new Rect()

    override run(): void {
        this.inputs.push(this.loadInput('src/assets/03-input.txt'))
        if (!this.inputs[0]) return

        console.log(`\n _`)
        console.log(`(_)   DAY THREE: Gear Ratios`)
        console.log('____________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.inputs.length = 0
    }

    /**
     * Setup function to make later processing easier.
     * 
     * Reads the entire input file once and stores each number - initial coordinates and full value - as an object in a reference grid.
     * This allows for easier processing later, as the reference will be the same regardless of the digit.
     */
    private setup(): void {
        this.lines = this.inputs[0].split('\n')
        this.dimensions = { w: this.lines[0].length, h: this.lines.length - 1 }
        this.refGrid = new Array(this.dimensions.h)
            .fill(new GridNumber())
            .map(() => new Array(this.dimensions.w).fill(new GridNumber()))
            
        // Fetch all numbers with their coordinates, while keeping the reference in refNum
        let refNum: GridNumber = new GridNumber()
        for (let x = 0; x < this.dimensions.h; x++) {
            for (let y = 0; y < this.dimensions.w; y++) {
                const char = this.lines[x][y]
                if (char >= '0' && char <= '9') {
                    refNum.addChar(char, x, y)
                    this.refGrid[x][y] = refNum
                }
                else {
                    refNum = new GridNumber()
                }
            }
        }
    }

    /**
     * Reads all adjacent characters when reading a symbol:
     * 
     *   - If a part number is found: add it to the total, then edit the input to remove every associated character to avoid duplicate readings
     *   - Otherwise, if the character is not a number or if we are at relative cooridnates (0,0): do nothing
     */
    private partOne(): void {
        let lines: string[] = this.lines.slice()
        let total: number = 0

        // This triple-nested for-loop is terrible. Too bad!
        //
        for (let x = 0; x < this.dimensions.h; x++) {
            for (let y = 0; y < this.dimensions.w; y++) {
                const char = lines[x][y]
                if ((char >= '0' && char <= '9') || char === '.') continue

                // Search for numbers all around the symbol
                for (let x1 = -1; x1 < 2; x1++) {
                    for (let y1 = -1; y1 < 2; y1++) {
                        const adjacentChar = lines[x + x1][y + y1]
                        if (x1 === 0 && y1 === 0) continue
                        if (adjacentChar < '0' || adjacentChar > '9') continue
                        let gridNum = this.refGrid[x + x1][y + y1]

                        total += parseInt(gridNum.str)
                        lines[gridNum.coords[0]] = replaceStringAt(lines[gridNum.coords[0]], gridNum.coords[1], '.'.repeat(gridNum.str.length))
                    }
                }
            }
        }
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Same as above, but only adds the part number to an array if the reference wasn't already found.
     * Then, simply calculates ratios for every gear connected to exactly two parts.
     */
    private partTwo(): void {
        let lines: string[] = this.lines.slice()
        let total: number = 0

        // Ditto, still too bad!
        //
        for (let x = 0; x < this.dimensions.h; x++) {
            for (let y = 0; y < this.dimensions.w; y++) {
                const char = lines[x][y]
                if (char !== '*') continue

                // Count part numbers first
                const gearParts: GridNumber[] = []
                for (let x1 = -1; x1 < 2; x1++) {
                    for (let y1 = -1; y1 < 2; y1++) {
                        const adjacentChar = lines[x + x1][y + y1]
                        if (x1 === 0 && y1 === 0) continue
                        if (adjacentChar < '0' || adjacentChar > '9') continue
                        let gridNum = this.refGrid[x + x1][y + y1]
                        if (!gearParts.find(part => part.coords === gridNum.coords)) gearParts.push(gridNum)
                    }
                }

                // Multiply only if we have two parts for the current gear
                if (gearParts.length !== 2) continue
                total += parseInt(gearParts[0].str) * parseInt(gearParts[1].str)
            }
        }
        console.log('* (Part 2) Answer: ' + total)
    }
}

/**
 * Utility class, stores a Rect (width, height, and origin)
 */
class Rect {
    w!: number
    h!: number
    x?: number
    y?: number
}

/**
 * Utility class, represents a part number and its initial coordinates in the input
 * 
 *   - str - string value of the number as-is
 *   - coords - initial coordinates as [x, y], with x = zero-indexed line number, y = zero-indexed character index
 */
class GridNumber {
    str: string
    coords: number[]

    toString(): string {
        return `\nGridNumber { str: '${this.str}', coords: [${this.coords.toString()}] }`;
    }

    constructor() {
        this.str = ''
        this.coords = []
    }

    addChar(char: string, x: number, y: number): void {
        this.str += char
        if (this.coords.length === 0) this.coords = [x, y]
    }

    isEmpty(): boolean {
        return this.str.length === 0
    }
}