var states = ["United States", "United States (Metropolitan Portion)", "United States (Nonmetropolitan Portion)", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
var codes = ["00000", "00998", "00999", "01000", "02000", "04000", "05000", "06000", "08000", "09000", "10000", "11000", "12000", "13000", "15000", "16000", "17000", "18000", "19000", "20000", "21000", "22000", "23000", "24000", "25000", "26000", "27000", "28000", "29000", "30000", "31000", "32000", "33000", "34000", "35000", "36000", "37000", "38000", "39000", "40000", "41000", "42000", "44000", "45000", "46000", "47000", "48000", "49000", "50000", "51000", "53000", "54000", "55000", "56000"]

// Set up page
$(document).ready(function() {

    //Set up tabbed window
    $('.tabs').tabs();


    //Set up dropdowns
    $('.accordion').accordion({
        active: false,
        collapsible: true,
        heightStyle: 'content'
    });


    //Set up add function
    $('#add').click(addNewSeries);



    //Populate initial chart
    var get_url = "http://bea.gov/api/data/?UserID=" + user_key
        + '&method=GetData'
        + '&datasetname=RegionalData'
        + '&KeyCode=' + $('#key_code').val()
        + '&GeoFips=53000';

    $.getJSON(get_url, function(data) {
        console.log(data)

        //Show chart
        var title = data.BEAAPI.Results.Statistic;
        var result_data = data.BEAAPI.Results.Data;
        var y_title = data.BEAAPI.Results.UnitOfMeasure;

        var to_graph = getDataPoints(result_data, 'TimePeriod', 'DataValue');

        $('#chart').highcharts({
            chart: {
                type: 'line',
                height: 600
            },
            title: {
                text: title
            },
            series: [{
                name: 'Washington',
                data: to_graph,
                allowPointSelect: true,
                compare: 'value'
            }],
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: y_title
                }
            },
            tooltip: {
                crosshairs: [true]
            },
            rangeSelector: {
                enabled: true,
                buttons: [{
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'year',
                    count: 5,
                    text: '5y'
                }, {
                    type: 'year',
                    count: 10,
                    text: '10y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },
            navigator: {
                enabled: true
            },
            scrollbar: {
                enabled: true
            }
        })


        //Add data options
        addOptions(title, 1, "Washington");
    });


    //Populate compare statistics
    var get_url = "http://bea.gov/api/data/?UserID=" + user_key
        + "&method=GetParameterValues"
        + "&datasetname=RegionalData"
        + "&ParameterName=KeyCode";

    $.getJSON(get_url, function(data) {
        var key_codes = data.BEAAPI.Results.ParamValue;
        for (var i = 0; i < key_codes.length; i++) {
            var option = $(document.createElement('option'))
                .val(key_codes[i].KeyCode)
                .text(key_codes[i].Description);
            $('#compare-stat').append(option)
        }
    })

    //Populate compare states
    for (var i = 0; i < states.length; i++) {
        var option = document.createElement('option')
        $(option).attr('value', codes[i] + " " + states[i])
            .text(states[i]);
        $('#compare-state').append(option);
    }



});







function getDataPoints(data, x_axis_key, y_axis_key) {
    var final = [];
    for (var i = 0; i < data.length; i++) {
        final.push([Date.UTC(data[i][x_axis_key]), parseInt(data[i][y_axis_key])]);
    }
    return final;
}




function addOptions(title, count, where) {
    var newTitle = $(document.createElement('h3'))
        .html('Data Set ' + count + ': ' + where + ' ' + title);

    var newOptions = $(document.createElement('div'))
        .append($(document.createElement('p')).html('Dataset-specific options'));

    //Add options to newOptions div
    if (count > 1) {
        newOptions.append($(document.createElement('button'))
            .val(count)
            .addClass('remove-set')
            .html('Remove Data Set')
            .click(removeSeries));
    }

    $('#graph-options').append(newTitle).append(newOptions)
        .accordion('refresh');
}



function addNewSeries() {
    var geoFIPS = $('#compare-state').val().split(" ")[0];
    var where = $('#compare-state').val().split(" ").slice(1).join(" ");
    var key_code = $('#compare-stat').val();

    if (geoFIPS != 'empty') {
        var get_url = "http://bea.gov/api/data/?UserID=" + user_key
            + '&method=GetData'
            + '&datasetname=RegionalData'
            + '&KeyCode=' + key_code
            + '&GeoFips=' + geoFIPS;

        $.getJSON(get_url, function(data) {
            var result_data = data.BEAAPI.Results.Data;
            var title = data.BEAAPI.Results.Statistic;
            var to_graph = getDataPoints(result_data, 'TimePeriod', 'DataValue');
            var chart = $('#chart').highcharts();

            chart.addSeries({
                name: where,
                data: to_graph,
                allowPointSelect: true
            });

            var count = $('#graph-options div').length - 1;
            addOptions(title, count, where);
        })
    }
}


function removeSeries() {
    var chart = $('#chart').highcharts();
    var seriesIndex = parseInt($(this).val());

    if(window.confirm("Are you sure you want to remove that data from the chart?")) {
        chart.series[seriesIndex].remove();

        var div_r = $(this).parent();
        var head_r = $('#graph-options').children('#' + div_r.attr('aria-labelledby'));
        div_r.slideUp(function() {
            div_r.remove();
            head_r.slideUp(function() {
                head_r.remove();
                reorderOptions();
            })
        })
    }
}


function reorderOptions() {
    var i = 0;
    var h_index = 1;

    $('#graph-options').children().each(function () {
        if (i > 3) {
            if (i%2 == 0) {
                var titleArray = $(this).text().split(" ");
                titleArray[2] = h_index + ':';
                var newTitle = titleArray.join(" ");
                $(this).text(newTitle);
            } else {
                $(this).children('button').val(h_index)
                h_index++;
            }

        }
        i++;
    });
}
