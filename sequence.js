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
            return {
                guessesRemaining: MAX_GUESSES,
                hints: []
            }
        },
        guess: function(a, b, c) {
            var guess = [a, b, c];
            var hint = [];
            var error = null;

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
                error = 'Out of guesses!';
            }
            return {
                guesses: guesses,
                guessesRemaining: MAX_GUESSES - guesses,
                guess: guess,
                hints: hint,
                error: error,
                answer: guesses >= MAX_GUESSES ? sequence : null,
                win: sequence[0] === a && sequence[1] === b && sequence[2] === c
            }
        }
    }
}

$(function() {
    var game = Sequence();

    $('#play').on('click', function(ev) {
        // Initialize the game
        updateDisplay( game.play() );
        // Hide instructions and show the game board
        $('.jumbotron').slideUp(800, function() {
            $('#game').hide().removeClass('hidden').slideDown(800, function() {
                $('#col1 input').focus();
            });
        });
    });

    // Handle guesses
    $('#guess').on('click', function(ev) {
        var a = $('#col1 input').val();
        var b = $('#col2 input').val();
        var c = $('#col3 input').val();
        if(a != '' && b != '' && c != '') {
            var result = game.guess(parseInt(a), parseInt(b), parseInt(c));
            updateDisplay(result);
            if(result.win) wonGame(result);
            else if(result.error) showError(result.error);
            else if(result.guessesRemaining <= 0) lostGame(result);
        } else {
            showError('Please fill in all fields to make a guess');
        }
    });

    // Prevent non-numeric entry
    $('.number').on('keypress', function(ev) {
        var num = parseInt(ev.key);
        if(isNaN(num)) {
            ev.preventDefault();
        }
    });

    $('#again').on('click', function(ev) {
        location.reload();
    });

    function showError(error) {
        $('#error').html(error).fadeIn(400).delay(2000).fadeOut(800);
    }
    function wonGame(status) {
        $('.panel').removeClass('panel-default').addClass('panel-success');
        $('.panel-heading').removeClass('hidden').html( $('<h1></h1>').append('YOU WIN!') );
        $('#guess').addClass('hidden');
        $('#again').removeClass('hidden');
    }
    function lostGame(status) {
        $('.panel').removeClass('panel-default').addClass('panel-danger');
        $('.panel-heading')
            .removeClass('hidden')
            .append( $('<h1></h1>').append('YOU LOSE') )
            .append( $('<h2></h2>').append('Sequence: ' + status.answer.join(' ')) );
        $('#guess').addClass('hidden');
        $('#again').removeClass('hidden');
    }
    function updateDisplay(status) {
        $('#remaining').html(status.guessesRemaining);
        for(var i = status.hints.length; i > 0 ; i--) {
            var hint = status.hints[i-1];
            var $icon = $('#col' + i + ' .glyphicon').removeClass().addClass('glyphicon');
            var $num = $('#col' + i + ' input')
                .removeClass('red green yellow')
                .attr('placeholder', status.guess[i-1]);
            // Set the correct colors for feedback
            if(hint.pos_ok) {
                $num.addClass('green').attr('readonly',true);
                $icon.addClass('glyphicon-ok');
            } else {
                if(hint.num_ok) {
                    $num.addClass('yellow');
                    $icon.addClass('glyphicon-resize-horizontal');
                } else {
                    $num.addClass('red');
                    $icon.addClass('glyphicon-ban-circle');
                }
                $num.val('').focus();
            }
        }
    }
});
