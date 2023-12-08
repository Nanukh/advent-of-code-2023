import { BaseChallenge } from './base-challenge.js'

/**
 * https://adventofcode.com/2023/day/8 \
 * NOTE: stumbled upon the second answer accidentally, see {@link partTwo}
 */
export default class HauntedWasteland extends BaseChallenge {

    private instructions: string = ''
    private network: Node[] = []

    public run(): void {
        this.loadInput('src/assets/08-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY EIGHT: Haunted Wasteland`)
        console.log('__________________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Setup function.\
     * Creates a graph from all nodes in the input, each pointing to a left and right node.
     */
    private setup(): void {
        const nodeRgx = new RegExp(/[A-Z]{3}/g)
        const lines = this.input.split('\n').filter(l => l)
        this.instructions = lines[0]
        for (const line of lines.slice(1).sort((a, b) => a.slice(0, 3).localeCompare(b.slice(0, 3)))) {
            const newNodes: Node[] = []
            const matches = Array.from(line.match(nodeRgx)!)
            let mainNode = this.network.find(n => n.value === matches[0])
            if (!mainNode) {
                mainNode = new Node(matches[0])
                newNodes.push(mainNode)
            }

            let leftNode = this.network.find(n => n.value === matches[1]) || newNodes.find(n => n.value === matches[1])
            if (!leftNode) {
                leftNode = new Node(matches[1])
                mainNode.left = leftNode
                newNodes.push(leftNode)
            }
            mainNode.left = leftNode

            let rightNode = this.network.find(n => n.value === matches[2]) || newNodes.find(n => n.value === matches[2])
            if (!rightNode) {
                rightNode = new Node(matches[2])
                mainNode.right = rightNode
                newNodes.push(rightNode)
            }
            mainNode.right = rightNode

            this.network.push(...newNodes)
        }
    }

    /**
     * Fetches the first node, then follows the instructions until finding the ZZZ node.
     */
    protected partOne(): void {
        let steps = 0
        let curNode = this.network.find(n => n.value === 'AAA')!
        for(let i = 0; i < this.instructions.length; i++) {
            curNode = this.instructions[i] === 'L' ? curNode.left! : curNode.right!
            steps++
            if (curNode.value === 'ZZZ') break
            if (i === this.instructions.length - 1) i = -1 // Repeat if we're not at ZZZ
        }
        console.log('* (Part 1) Answer: ' + steps)
    }

    /**
     * _NOTE: Only works because of implicit properties of the input, see_ https://www.reddit.com/r/adventofcode/comments/18dfpub/2023_day_8_part_2_why_is_spoiler_correct/ \
     * 
     * Calculates each path's number of required steps until reaching a --Z node, then calculates the LCM of all of them. \
     * Of note is that iterating from Z to Z' (also from Z' to Z" and onwards) reveals that each path is in fact a cycle, and the length between Z nodes is the same.
     */
    protected partTwo(): void {
        let startingNodes = this.network.filter(node => node.value.endsWith('A'))!
        const simultaneousPaths = startingNodes.slice().length

        // Compute total number of steps for each path
        const pathsSteps: number[] = []
        for (let n = 0; n < simultaneousPaths; n++) {
            let curNode: Node = startingNodes[n]
            let steps = 0
            for(let i = 0; i < this.instructions.length; i++) {
                curNode = this.instructions[i] === 'L' ? curNode.left! : curNode.right!
                steps++
                if (curNode.value.endsWith('Z')) {
                    pathsSteps.push(steps)
                    break
                }
                if (i === this.instructions.length - 1) {
                    i = -1
                }
            }
        }

        // Then calculate the Least Common Multiple (LCM) of these numbers
        const greatestCommonDivisor = (a: number, b: number): number => a ? greatestCommonDivisor(b % a, a) : b;
        const lowestCommonMultiple = (a: number, b: number): number => a * b / greatestCommonDivisor(a, b);
        console.log('* (Part 2) Answer: ' + pathsSteps.reduce(lowestCommonMultiple))
    }

}

/**
 * Utility class, represents a node with two links to other nodes (left and right)
 */
class Node {
    value: string
    left?: Node
    right?: Node

    constructor(value: string, left?: Node, right?: Node) {
        this.value = value
        this.left = left
        this.right = right
    }
}