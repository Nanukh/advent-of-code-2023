import { BaseChallenge } from "./base-challenge.js";
import { replaceStringAt } from '../utils.js'

export class DayThreeGearRatios extends BaseChallenge {

    static inputs: String[] = []
    static lines: string[]

    static refGrid: GridNumber[][]
    static dimensions: Rect

    static override run(): void {
        console.log('\nDAY THREE: Gear Ratios')
        console.log('---------------------------------------')
        this.inputs.push(this.loadInput('src/assets/day-three-input.txt'))
        this.setup()
        this.partOne()
        this.partTwo()
        this.inputs.length = 0
    }

    private static setup(): void {
        this.lines = this.inputs[0].split('\n')
        this.dimensions = { w: this.lines[0].length, h: this.lines.length - 1 }
        this.refGrid = new Array(this.dimensions.h)
            .fill(new GridNumber())
            .map(() => new Array(this.dimensions.w).fill(new GridNumber()))
            
        // Fetch all numbers with their coordinates
        const gridNums: GridNumber[] = []
        let curNum: GridNumber = new GridNumber()
        for (let x = 0; x < this.dimensions.h; x++) {
            for (let y = 0; y < this.dimensions.w; y++) {
                const char = this.lines[x][y]
                if (char >= '0' && char <= '9') {
                    curNum.addChar(char, x, y)
                    this.refGrid[x][y] = curNum
                }
                else {
                    if (!curNum.isEmpty()) gridNums.push(curNum)
                    curNum = new GridNumber()
                }
            }
        }
    }

    private static partOne(): void {
        let lines: string[] = this.lines.slice()
        let total: number = 0
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

    private static partTwo(): void {
        let lines: string[] = this.lines.slice()
        let total: number = 0
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

class Rect {
    w!: number
    h!: number
    x?: number
    y?: number
}

class GridNumber {
    str: string
    coords: number[] = []

    toString(): string {
        return `\nGridNumber { str: '${this.str}', coords: [${this.coords.toString()}] }`;
    }

    constructor() {
        this.str = ''
    }

    addChar(char: string, x: number, y: number): void {
        this.str += char
        if (this.coords.length === 0) this.coords = [x, y]
    }

    isEmpty(): boolean {
        return this.str.length === 0
    }
}