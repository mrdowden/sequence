var Sequence = function() {
    'use strict';

    // UTILITY METHODS
    var swap = function(ary, i, j) {
        var t = ary[i];
        ary[i] = ary[j];
        ary[j] = t;
    }
    var shuffle = function(ary) {
        for(var i = ary.length - 1; i >= 1; i--) {
            var r = Math.round(Math.random() * i);
            swap(ary, r, i);
        }
        return ary;
    }
    var generateNumbers = function() {
        return shuffle([1,2,3,4,5,6,7,8,9,0]).slice(0, 3);
    }
    var generateHint = function(index, guess) {
        var match = sequence[index] === guess;
        return {
            pos_ok: match,
            num_ok: match || sequence.includes(guess)
        }
    }
    // GAME RULES
    var MAX_GUESSES = 10;
    // GAME STATE
    var sequence;
    var guesses = 0;

    // GAME OBJECT
    return {
        play: function() {
            sequence = generateNumbers();
            guesses = 0;
            console.log(sequence);
        },
        guess: function(a, b, c) {
            var guess = [a, b, c];
            var hint = [];
            var error;

            if(guesses < MAX_GUESSES) {
                //Count the guess
                guesses++;
                // Generate Hints
                hint = [
                    generateHint(0, a),
                    generateHint(1, b),
                    generateHint(2, c)
                ]
            } else {
                error = "Out of guesses!";
            }
            return {
                totalGuesses: guesses,
                guess: guess,
                hints: hint,
                error: error,
                win: sequence[0] === a && sequence[1] === b && sequence[2] === c
            }
        }
    }
}

var game = Sequence();
game.play();
console.log( game.guess(1, 2, 3) );
console.log( game.guess(2, 1, 4) );
console.log( game.guess(3, 0, 5) );
console.log( game.guess(4, 9, 6) );
console.log( game.guess(5, 8, 7) );
console.log( game.guess(6, 7, 8) );
console.log( game.guess(7, 6, 9) );
console.log( game.guess(8, 5, 0) );
console.log( game.guess(9, 4, 1) );
console.log( game.guess(0, 3, 2) );
console.log( game.guess(1, 2, 3) );

//$(function() { )


//});
