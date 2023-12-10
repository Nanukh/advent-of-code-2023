import { findPointInPolygon, replaceStringAt } from '../utils.js'
import { BaseChallenge } from './base-challenge.js'
import fs from 'node:fs'

/**
 * https://adventofcode.com/2023/day/10 \
 * Getting pretty hard already...
 */
export default class PipeMaze extends BaseChallenge {

    private possibleAdjacentPipes: Map<string, string[]> = new Map<string, string[]>([
        ['S', ['|7F', '-7J', '|JL', '-FL']], // NESW
        ['|', ['|7F', '', '|JL', '']],
        ['-', ['', '-7J', '', '-FL']],
        ['7', ['', '', '|JL', '-FL']],
        ['F', ['', '-7J', '|JL', '']],
        ['J', ['|7F', '', '', '-FL']],
        ['L', ['|7F', '-7J', '', '']]
    ])
    private pipeMatrix: string[] = []
    private startingPosition: number[] = []

    public run(): void {
        this.loadInput('src/assets/10-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY TEN: Pipe Maze`)
        console.log('________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }
    
    /**
     * Setup function. \
     * Fetches the starting position of the loop (zero-indexed)
     */
    private setup(): void {
        const lines = this.input.split('\n').filter(l => l)
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('S')) {
                this.startingPosition = [lines[i].indexOf('S'), i]
            }
            this.pipeMatrix.push(lines[i])
        }
    }

    /**
     * Starts at the 'S' coordinates, then progressively finds the next adjacent pipe until looping back to the start. \
     * Since we are in a 2D space with only horizontal/vertical movement, the loop will always have an even number of pipes.
     * 
     * See {@link findAdjacentPipeCoords} for details.
     */
    protected partOne(): void {
        const visitedCoords: number[][] = [this.startingPosition]
        let adjacentPipeCoords: number[][] = []
        for (let steps = 0; steps < (this.pipeMatrix.length * this.pipeMatrix[0].length); steps++) {
            adjacentPipeCoords = this.findAdjacentPipeCoords(
                visitedCoords.at(-1)![0], visitedCoords.at(-1)![1],
                visitedCoords.at(-2) ? visitedCoords.at(-2)![0]: undefined,
                visitedCoords.at(-2) ? visitedCoords.at(-2)![1]: undefined,
            )
            if (adjacentPipeCoords.length === 0) break
            visitedCoords.push(adjacentPipeCoords[0])
        }
        console.log('* (Part 1) Answer: ' + visitedCoords.length / 2)
    }

    /**
     * Does the same as partOne, but then uses an implementation of the even-odd rule (or ray-casting algorithm)
     * to check if each point on the matrix is inside or outside the polygon. \
     * See `utils/findPointInPolygon` for the algorithm (picked from the web)
     * 
     * _Didn't manage to make it work with the Shoelace formula (https://wikipedia.org/wiki/Shoelace_formula)..._
     */
    protected partTwo(): void {
        // First, redo part one to fetch all visited points that represent the overall polygon
        let visitedCoords: number[][] = [this.startingPosition]
        let adjacentPipeCoords: number[][] = []
        for (let steps = 0; steps < (this.pipeMatrix.length * this.pipeMatrix[0].length); steps++) {
            adjacentPipeCoords = this.findAdjacentPipeCoords(
                visitedCoords.at(-1)![0], visitedCoords.at(-1)![1],
                visitedCoords.at(-2) ? visitedCoords.at(-2)![0]: undefined,
                visitedCoords.at(-2) ? visitedCoords.at(-2)![1]: undefined,
            )
            if (adjacentPipeCoords.length === 0) break
            visitedCoords.push(adjacentPipeCoords[0])
        }

        // Remove 'S' pipe if the total number of visited coordinates is odd (if even, S is a corner pipe)
        // Since we are only moving by steps of one on x and/or y, the total number of points for a polygon will always be even.
        if (visitedCoords.length % 2 !== 0) visitedCoords.splice(0, 1)

        // Then, loop on each point and check if it's inside the polygon
        let total = 0
        for (let y = 0; y < this.pipeMatrix.length; y++) {
            for (let x = 0; x < this.pipeMatrix[0].length; x++) {
                if (visitedCoords.find(c => c[0] === x && c[1] === y)) continue
                total += findPointInPolygon(visitedCoords, [x, y]) ? 1 : 0
            }
        }
        console.log('* (Part 2) Answer: ' + total)
    }

    /**
     * Self-explanatory, gets the character on the matrix from its coordinates
     */
    private getPipe(x: number, y: number): string | undefined {
        return this.pipeMatrix[y] ? this.pipeMatrix[y][x] : undefined
    }

    /**
     * Finds the next valid coordinates from a given position, taking into account the last visited coordinates
     * @param x current X position
     * @param y current Y position
     * @param lastX last visited X position
     * @param lastY last visited Y position
     * @returns Two points if we check 'S' (the overall pipe is a loop), zero if we are back at the start, one otherwise
     */
    private findAdjacentPipeCoords(x: number, y: number, lastX?: number, lastY?: number): number[][] {
        let adjacentPipeCoords: number[][] = []
        let adjacentCoords: number[][] = [[x, y-1], [x+1, y], [x, y+1], [x-1, y]] // NESW

        const startingPipe = this.getPipe(x, y)!
        adjacentCoords.forEach((coords, i) => {
            if (coords[0] === lastX && coords[1] === lastY) return // Skip last coord
            let pipe = this.getPipe(coords[0], coords[1])
            if (!pipe) return

            const isAdjacentPipe = this.possibleAdjacentPipes.get(startingPipe)![i].includes(pipe)
            if (!isAdjacentPipe) return
            adjacentPipeCoords.push(coords)
        })
        return adjacentPipeCoords
    }
}