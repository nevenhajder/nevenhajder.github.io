/*jslint browser: true*/
/*global $, jQuery, alert*/


var main = function() {
    "use strict";
    /* Add class fa-spin to #flip when user hovers */
    $('#flip').hover(
        function() {
            $('#flip i').addClass('fa-spin');
        },
        function() {
            $('#flip i').removeClass('fa-spin');
        }
    );

    /* Variables for carousel manipulation */
    var carousel = $('.carousel-wrap'),
        selectedCard = $('.selected > .inner-card-wrap'),
        tranZ = 277,
        rotY = 0;


    /* Update .selected */
    var selectNext = function() {
        var $next = $('.selected').removeClass('selected').next('.card-wrap');

        if ($next.length) {
            $next.addClass('selected');
        } else {
            $('.card-wrap:first-child').addClass('selected');
        }

        selectedCard = $('.selected > .inner-card-wrap');
    };

    var selectPrev = function() {
        var $prev = $('.selected').removeClass('selected').prev('.card-wrap');

        if ($prev.length) {
            $prev.addClass('selected');
        } else {
            $('.card-wrap:last-child').addClass('selected');
        }

        selectedCard = $('.selected > .inner-card-wrap');
    };


    /* Rotate carousel on #next.click */
    $('#next').on('click',
        function() {
            rotY -= 60;
            carousel.css('-webkit-transform', 'translateZ(-' + tranZ + 'px) rotateY(' + rotY + 'deg)');

            selectNext();
        });

    /* Rotate carousel on #previous.click */
    $('#previous').on('click',
        function() {
            rotY += 60;
            carousel.css('-webkit-transform', 'translateZ(-' + tranZ + 'px) rotateY(' + rotY + 'deg)');

            selectPrev();
        });


    /* Flip the card */
    $('#flip').on('click',
        function() {
            if (selectedCard.hasClass('flipped')) {
                selectedCard.css('-webkit-transform', 'rotateY(0)').toggleClass('flipped');
            } else {
                selectedCard.css('-webkit-transform', 'rotateY(180deg)').toggleClass('flipped');
            }
        });
};

main();