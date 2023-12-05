import { BaseChallenge } from "./base-challenge.js";

/**
 * https://adventofcode.com/2023/day/5 \
 * **NOTE: help used on part 2**
 */
export default class IfYouGiveASeedAFertilizer extends BaseChallenge {

    private seeds: number[] = []
    private conversionMapGroups: Array<ConversionMap> = []

    public run(): void {
        this.loadInput('src/assets/05-input.txt')
        if (!this.input) return

        console.log(`\n _`)
        console.log(`(_)   DAY FIVE: If You Give A Seed A Fertilizer`)
        console.log('_______________________________________________\n')
        this.setup()
        this.partOne()
        this.partTwo()
        this.input = ''
    }

    /**
     * Setup function.\
     * Parses the input into 1) a list of seeds, and 2) a list of conversion maps, each containing the destination/source/range values of every line.
     */
    private setup(): void {
        const letterRgx: RegExp = new RegExp(/^\D/g)
        let lines: string[] = this.input.split('\n').filter(l => l)

        // Prepare seeds and remove lines
        this.seeds.push(...lines[0].substring(7).split(' ').map(s => parseInt(s)))
        lines.splice(0, 2)

        // Prepare conversion map groups
        let conversionMapEntries: ConversionMapEntry[] = []
        lines.forEach(line => {
            if (line.match(letterRgx) && conversionMapEntries.length > 0) {
                this.conversionMapGroups.push(new ConversionMap(conversionMapEntries.slice(0)))
                conversionMapEntries.length = 0
                return
            }
            const mapEntry: number[] = line.split(' ').map(s => parseInt(s))
            conversionMapEntries.push(new ConversionMapEntry(mapEntry[0], mapEntry[1], mapEntry[2]))
        })
        this.conversionMapGroups.push(new ConversionMap(conversionMapEntries.slice(0))) // Last entry
    }

    /**
     * Iterates on the given seed numbers, converts them one by one to their associated location, and finally finds the smallest among the latter.
     */
    protected partOne(): void {
        const locations: number[] = []
        this.seeds.forEach(seed => {
            this.conversionMapGroups.forEach(cgroup => {
                seed = cgroup.convert(seed)
            })
            locations.push(seed)
        })
        console.log('* (Part 1) Answer: ' + Math.min(...locations))
    }

    /**
     * **NOTE: needed some help on this one... slow implementation but does the job**
     * 
     * Iterates instead on every possible location number (no restrictions as opposed to seeds), then reverts each of them to its associated seed.\
     * The seed is valid if we have it in the given seed ranges.
     */
    protected partTwo(): void {
        const seedGroups: SeedGroup[] = []
        for (let s = 0; s < this.seeds.length; s += 2) {
            seedGroups.push(new SeedGroup(this.seeds[s], this.seeds[s + 1]))
        }

        let location
        for (location = 0; location < Number.MAX_SAFE_INTEGER; location++) {
            let revertedSeed = location
            for (const group of this.conversionMapGroups.slice().reverse()) {
                revertedSeed = group.revert(revertedSeed)
            }
            if (seedGroups.findIndex((sg) => sg.contains(revertedSeed)) !== -1) {
                break
            }
        }
        console.log('* (Part 2) Answer: ' + location)
    }
}

/**
 * Utility class, represents one map of the input (e.g. soil-to-fertilizer)
 */
class ConversionMap {
    entries: ConversionMapEntry[] = []

    constructor(entries: ConversionMapEntry[]) {
        this.entries = entries//.sort((a, b) => a.source - b.source)
    }

    /**
     * Maps a given source number to a destination according to this conversion map.\
     * Source numbers that aren't mapped simply return themselves.
     * 
     * @param src source number (seed, soil, fertilizer, etc)
     * @returns the mapped destination number
     */
    convert(src: number): number {
        const entry: ConversionMapEntry | undefined = this.entries.find(e => src >= e.source && src < e.source + e.range)
        return entry ? entry.destination + (src - entry.source) : src
    }

    /**
     * Same as {@link ConversionMap.convert}, but doing the reverse operation.
     * @param dest destination number
     * @returns the mapped source number
     */
    revert(dest: number): number {
        const entry: ConversionMapEntry | undefined = this.entries.find(e => dest >= e.destination && dest < e.destination + e.range)
        return entry ? entry.source + (dest - entry.destination) : dest
    }
}

/**
 * Utility class, represents an entry of {@link ConversionMap}
 */
class ConversionMapEntry {
    destination: number
    source: number
    range: number

    toString(): string {
        return `{dest(${this.destination}), src(${this.source}), range(${this.range})}`
    }

    constructor(destination: number, source: number, range: number) {
        this.destination = destination
        this.source = source
        this.range = range
    }
}

/**
 * Utility class, represents one pair of seed values at the start of the file (e.g. 79 14)
 */
class SeedGroup {
    start: number
    range: number

    constructor (start: number, range: number) {
        this.start = start
        this.range = range
    }

    contains(seed: number) {
        return seed >= this.start && seed < this.start + this.range
    }
}