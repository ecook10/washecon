$(document).ready(function() {

    ////Set up tabbed window
    //$('.tabs').tabs();
    //
    ////Set up dropdowns
    //$('.accordion').accordion({
    //    active: false,
    //    collapsible: true,
    //    heightStyle: 'content'
    //});

    load_accordions();
    $('.selectable').selectable();

    //If options are loaded, display and load the first one
    if ($('#tab-headers a').length > 1) {
        var new_option = $('#main > div').eq(1);

        if (new_option.children('.select').length > 0) {
            // If needed, populate selectable element (method will handle showing new tab)
            populateSelect(new_option, 1);
        }

        load_tabs(1);
    } else {
        load_tabs(0);
    }

    $('.submit').click(submitOption);

});



function submitOption(event) {
    // Handle option form being submitted... Validate form, save response, and either show next option or take user to graph

    var submitted_form = $(event.target).parent().parent();

    if (formValidated(submitted_form)) {

        // Save response
        $('#parameters .' + submitted_form.attr('id')).val(getOptionValue(submitted_form));

        console.log(submitted_form.attr('id'));

        // Advance through options
        var new_tab_index = get_tab_index() + 1;

        if (new_tab_index + 1 == $('#tab-headers li').length) {
            // If new_tab_index is the final option, collect parameters and show series graph
            showGraph();

        } else {
            // Show next option, load any option parameters
            var new_option = $('#main > div').eq(new_tab_index);

            if (new_option.children('.select').length > 0) {
                // If needed, populate selectable element (method will handle showing new tab)
                populateSelect(new_option, new_tab_index);

            } else {
                // Show new tab
                load_tab_by_index(new_tab_index);
                $('#tab_headers li').eq(new_tab_index).css('display', '');

            }
        }

    } else {
        promptError(submitted_form);
    }
}




function getOptionValue(option) {
    // Accepts an option div DOM object and returns its value

    var option_type = $(option).children('.method').val();

    // If new option_type is added, MUST add new if statement here that retrieves that type's value, else function returns NULL
    if (option_type == 'radio') {
        return $(option).find('input:checked').val();

    } else if (option_type == 'select') {
        var final = [];
        $(option).find('.ui-selected').each(function (i, selected) {
            final.push($(selected).attr('value'));
        });

        alert(final);
        return final;

    } else {
        return null;
    }
}



function formValidated(form) {
    // Accepts form option div DOM object and checks if form is filled out correctly

    return true;
}



function promptError(form) {
    // Accepts form div DOM object and displays error message

    alert("C'mon man...");
    return;
}





function populateSelect(new_option, tab_index) {
    //Accepts an option div DOM object, loads its available options, and displays option

    // Convert parameters in HTML to django get request
    var get_url = '/regionaldata/getdata';
    var options = {
        'type': 'getselectdata',
        'url': 'http://bea.gov/api/data'
    };

    $(new_option).find('.params input').each(function(index, label) {
        // For each parameter in the select option, add to request URL
        var to_add = replaceTag($(label).val());

        options[$(label).attr('class')] = encodeURIComponent(to_add);
    });

    // Retrieve selectable items, add to html list
    $.get(get_url, options, function(data) {

        var items = JSON.parse(data);
        var select_list = new_option.find('.selectable');

        // If select menu selects describes years
        if (new_option.attr('id') == 'Year') {
            items = items.reverse();

            // Add 'ALL' option
            select_list.append($(document.createElement('li'))
                .attr('value', 'ALL')
                .text('ALL'));
        }

        for (var i = 0; i < items.length; i++) {

            select_list.append($(document.createElement('li'))
                    .val(items[i].val)
                    .text(items[i].name));
        }

        // Get everything looking alright
        select_list.css('display', '');

        new_option.find('.loading').css('display', 'none');

        load_tab_by_index(tab_index);

    });


}

function getFinalKey() {
    // Returns series key with all tags replaced with final values

    // Get initial key (w/ tags)
    var final_key = $('#series_key').val();

    // If an option form replaces a tag, replace the key's tag
    $('#parameters input').each(function(index, param) {
        var tag = $(param).attr('class');
        if (tag.charAt(0) == '_') {
            tag = tag.replace('_', '%');
            var opt_val = $(param).val();
            final_key = final_key.replace(tag, opt_val);
        }
    });

    return final_key;
}




function replaceTag(tag) {
    // Replaces a tag with its specified value (i.e. %f -> final series code), if no tag is passed returns self

    if (tag == '%f') {
        return getFinalKey();

    } else if (tag.charAt(0) != '%') {
        return tag;

    } else {
        return null;
    }
}



function showGraph() {
    //Reads all form input and reroutes user to graph url

    // Build redirect URL
    var redirect_url = '/regionaldata/showdata/?';
    $('#parameters').children().each(function(index, param) {

        var param_val = $(param).val();
        var param_key = $(param).attr('class');

        if (param_val != '' && param_key.charAt(0) != '_') {
            redirect_url = redirect_url + encodeURIComponent(param_key) + '=' + encodeURIComponent(replaceTag(param_val)) + '&';

        } else {
            //Error...
        }
    });

    alert(redirect_url);
    window.location.assign(redirect_url);

}


