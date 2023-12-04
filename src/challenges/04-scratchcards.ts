import { BaseChallenge } from "./base-challenge.js";

/**
 * https://adventofcode.com/2023/day/4
 */
export default class Scratchcards extends BaseChallenge {

    cardsWithDuplicates: CardWithDuplicates[] = []

    run(): void {
        this.loadInput('src/assets/04-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY FOUR: Scratchcards`)
        console.log('____________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Setup function.\
     * Reads every card and extracts its numbers, sorts them and calculates the number of duplicates (i.e. winning numbers)
     * 
     * See {@link CardWithDuplicates}
     */
    private setup(): void {
        const numbersRgx: RegExp = new RegExp(/(\d{1,2})/g)
        const cards = this.input.split('\n').map(card => card.substring(10))
        cards.forEach((card, index) => {
            let matches: RegExpMatchArray | null = card.match(numbersRgx)
            if (!matches) return

            const numbers = matches.map(n => parseInt(n)).sort()
            const duplicates = numbers.filter((e, i, a) => a[i-1] === e)
            this.cardsWithDuplicates.push(new CardWithDuplicates(numbers, duplicates.length))
        })
    }

    /**
     * Simply calculates each valid card's value as `{x = 2^(n-1) : n > 0}`
     */
    protected partOne(): void {
        let total = 0
        this.cardsWithDuplicates.forEach(card => {
            if (card.matchingNumbers === 0) return
            total += Math.pow(2, card.matchingNumbers - 1)
        })
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Uses a cascading algorithm that, for each card with matching numbers, iterates on the next n cards (where n = n° of matching numbers of the current card)
     * and increments their number of instances by the current card's number of instances. This "creates" n new cards through a counter instead of a full representation.\
     * The algorithm then repeats itself for every card instance, progressing through the list until the end.
     */
    protected partTwo(): void {
        let total = 0
        this.cardsWithDuplicates.forEach((card, index) => {
            if (card.matchingNumbers === 0) return
            for (let copyIndex = index + 1; copyIndex < this.cardsWithDuplicates.length && copyIndex <= index + card.matchingNumbers; copyIndex++) {
                this.cardsWithDuplicates[copyIndex].instances += card.instances
            }
        })
        total = this.cardsWithDuplicates.reduce((acc: number, card: CardWithDuplicates) => acc += card.instances, 0)
        console.log('* (Part 2) Answer: ' + total)
    }
}

/**
 * Utility class to store a representation of a scratchcard and it's number of instances (original + copies)
 */
class CardWithDuplicates {
    numbers: number[]
    matchingNumbers: number
    instances: number

    constructor(numbers: number[], matchingPairs: number) {
        this.numbers = numbers
        this.matchingNumbers = matchingPairs
        this.instances = 1
    }
}