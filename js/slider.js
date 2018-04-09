
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

let currentCharSelected = "";
$('.main').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    currentCharSelected = $('.slick-slide.slick-current.slick-active').attr('id');
});

$('.go').click(function () {
    $('.character').css('display', 'none');
    player.changeSprite(currentCharSelected);
});