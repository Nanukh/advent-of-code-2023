import { BaseChallenge } from './challenges/base-challenge.js'
import challenges from './challenges/index.js'

console.log(`
               _   ★             _            __    _____          _     
      /\\      | |               | |          / _|  / ____|        | |  ★
  ★  /  \\   __| |_   _____ _ __ | |_    ___ | |_  | |     ___   __| | ___ 
    / /\\ \\ / _\` \\ \\ / / _ \\ \'_ \\| __|  / _ \\|  _| | |    / _ \\ / _\` |/ _ \\
   / ____ \\ (_| |\\ \V /  __/ | | | |_  | (_) | |   | |___| (_) | (_| |  __/
  /_/    \\_\\__,_| \\_/ \\___|_| |_|\\__|  \\___/|_|    \\_____\\___/ \\__,_|\\___|
                                                ★
  (https://adventofcode.com) - Eric Wastl                        >>> 2023
  _______________________________________________________________________
                              |  
  Stars collected:  16 / 50   |                            Code by Nanukh
  ********.................   |                 https://github.com/Nanukh
  `)
setTimeout(() => {
    challenges.forEach((c: BaseChallenge) => c.run())
    console.log(`
    
        _                                                         _   
       ( )                                                       ( )  
      _|/    ______   ______   _  __   __  _   ______   ______    \\|_ 
     (_)    |______| |______| (_) \\ \\ / / (_) |______| |______|    (_)
                                   \\ V /                              
                                    \\_/                               
    `)
}, 1000)