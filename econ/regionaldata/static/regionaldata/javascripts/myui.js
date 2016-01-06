
function load_tabs(initial_index) {

    $('.active-tab').removeClass('active-tab');
    $('.active-tab-header').removeClass('active-tab-header');

    $('.tabs > div').eq(initial_index).css('display', 'block').addClass('active-tab');
    $('#tab-headers li').eq(initial_index).css('display', 'block').addClass('active-tab-header');

    $('#tab-headers a').click(function(event) {
        event.preventDefault();

        load_tab_by_index($(this).index())
    })

}

function load_tab_by_index(index) {

    var new_tab = $('.tabs > div').eq(index);

    $('.tabs .active-tab').fadeOut('fast', function() {
        $(this).removeClass('active-tab');
        new_tab.addClass('active-tab');
        new_tab.fadeIn('slow');
    })

    $('.active-tab').removeClass('active-tab');
    $('.active-tab-header').removeClass('active-tab-header');
    $('#tab-headers li').eq(index).addClass('active-tab-header').css('display', '');

}

function get_tab_index() {

    var final = -1;

    $('#tab-headers li').each(function(index, value) {
        if ($(value).hasClass('active-tab-header')) {
            final = index;
        }
    })

    return final;
}

function load_accordions() {

    $('.accordion h3').click(function() {

        var div_to_show = $(this).next();
        var header = $(this);

        if (header.hasClass('active')) {
            div_to_show.slideUp('slow', function() {
                header.toggleClass('active');
            })
        } else {
            header.toggleClass('active');
            div_to_show.slideDown('slow');
        }
    })
}