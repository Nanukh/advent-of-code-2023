import { BaseChallenge } from './base-challenge.js'

/**
 * https://adventofcode.com/2023/day/7
 */
export default class CamelCards extends BaseChallenge {

    cardStrengths: string[] = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
    jokerizedCardStrengths: string[] = ['A','K','Q','T','9','8','7','6','5','4','3','2','J']

    public run(): void {
        this.loadInput('src/assets/07-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY SEVEN: Camel Cards`)
        console.log('____________________________\n')
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Initializes every hand, sorts them by strength, then by every letter for tie-breaks.
     * Finally, computes the total winnings by reversing the list and multiplying each hand's index+1 (its rank) by its winnings
     */
    protected partOne(): void {
        const hands: Hand[] = this.input.split('\n').filter(l => l).map(line => {
            const parsedLine = line.split(' ')
            return new Hand(parsedLine[0], parseInt(parsedLine[1]), this.cardStrengths)
        })

        const sortedHands = this.sortHands(hands, this.cardStrengths)
        let total = sortedHands.reduce((acc: number, cur: Hand, i: number) => acc += cur.winnings * (i + 1), 0)
        console.log('* (Part 1) Answer: ' + total)
    }

    /**
     * Same as before, except with the updated strength order and "jokerized" sorting enabled
     */
    protected partTwo(): void {
        const hands: Hand[] = this.input.split('\n').filter(l => l).map(line => {
            const parsedLine = line.split(' ')
            return new Hand(parsedLine[0], parseInt(parsedLine[1]), this.jokerizedCardStrengths, true)
        })

        const sortedHands = this.sortHands(hands, this.jokerizedCardStrengths)
        let total = sortedHands.reduce((acc: number, cur: Hand, i: number) => acc += cur.winnings * (i + 1), 0)
        console.log('* (Part 2) Answer: ' + total)
    }

    /**
     * Utility function, sorts hands according to the given card strength order, then reverses the list to get the weakest hand first
     * @param hands the hands to sort
     * @param cardStrengths the strength order
     * @returns the sorted hands
     */
    sortHands(hands: Hand[], cardStrengths: string[]) {
        return hands.slice().sort((a: Hand, b: Hand) => {
            const lengthSort = a.strength - b.strength
            for (let i = 0; i < a.str.length; i++) {
                if (a.str[i] === b.str[i]) continue
                return lengthSort || (cardStrengths.indexOf(b.str[i]) - cardStrengths.indexOf(a.str[i]))
            }
            return 0
        })
    }
}

/**
 * Utility class, represents a hand with its cards.\
 * The cards are sorted during instantiation according to the given card strength order.
 */
class Hand {
    str: string
    sortedStr: string
    jokerizedStr: string = ''
    strength: number = -1 // 7 to 1 (five-of-a-kind, four-of-a-kind, full-house, three-of-a-kind, double-pair, single-pair, high-card)
    winnings: number

    constructor(str: string, winnings: number, cardStrengths: string[], jokerize: boolean = false) {
        this.str = str
        this.winnings = winnings
        this.sortedStr = this.str.split('').sort((a, b) => cardStrengths.indexOf(a) - cardStrengths.indexOf(b)).join('')

        const matches = this.sortedStr.match(/(.)\1*/g)!
        let cardGroups = Array.from(matches).sort((a, b) => (b.length - a.length))

        // If part two: fetch joker cards and replace them by the strongest card in the hand, or the strongest overall if none are found
        const jokerCardsIdx = cardGroups.findIndex(tc => tc[0] === 'J')
        if (jokerize && jokerCardsIdx !== -1) {
            const bestCardExclJokerIdx = cardGroups.findIndex(tc => tc[0] !== 'J')
            if (bestCardExclJokerIdx === -1) {
                cardGroups[jokerCardsIdx] = cardGroups[jokerCardsIdx].replaceAll('J', cardStrengths[0])
            } else {
                cardGroups[bestCardExclJokerIdx] += cardGroups[jokerCardsIdx].replaceAll('J', cardGroups[bestCardExclJokerIdx][0])
                cardGroups.splice(jokerCardsIdx, 1)
            }
            this.jokerizedStr = cardGroups.join('')
        }

        // Calculate this hand's strength depending on its card subgroups
        switch(cardGroups.length) {
            case 1: this.strength = 7; break // KKKKK
            case 2: this.strength = (cardGroups[0].length === 4) ? 6 : 5; break // KKKK9 or KKK77
            case 3: this.strength = (cardGroups[0].length === 3) ? 4 : 3; break // KKKQ9 or KKQQ9
            case 4: this.strength = 2; break // KKQ97
            case 5: this.strength = 1; break // KQ973
        }
    }
}