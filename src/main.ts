import { DayOneTrebuchet, DayTwoCubeConundrum } from './challenges/index.js'

// Main file
// Yes, this method of organizing and running things is terrible. No, I don't care.

console.log('***************************')
console.log('*** Advent of Code 2023 ***')
console.log('***************************')
setTimeout(() => {
    DayOneTrebuchet.run()
    DayTwoCubeConundrum.run()
}, 100)
