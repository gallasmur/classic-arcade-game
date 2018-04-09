/**
 * I use jQuery in this file because it was a dependancy needed for the slick library
 */
$(document).ready(function () {
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true
    });
    $('.slick-slide:first').focus();
});

/**
 * When the current slide is changed, register that change
 */
let currentCharSelected = "";
$('.main').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    currentCharSelected = $('.slick-slide.slick-current.slick-active').attr('id');
});

/**
 * When the player has decided which character to choose and click the button, hide the slider and set the sprite
 */
$('.go').click(function () {
    // $('.character').css('display', 'none');
    $('.character').addClass('hidden');
    player.changeSprite(currentCharSelected);
});