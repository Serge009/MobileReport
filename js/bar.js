function showBarGraph(sql) {
    console.log('showBarGraph');
    $('#shadow').show();
    $('#line #container, table.details thead, table.details tbody').html('');

    console.log("bar graph sql = " + graph_options.sql_command);

    try {
        if (!sql)
            sql = createFilterTable('filters-list', info.graph_filter,
                info.graph_filter_items, graph_id, graph_options.sql_command, true);
        else
            sql = createFilterTable('filters-list', info.graph_filter,
                info.graph_filter_items, graph_id, graph_options.sql_command, false);
    } catch (e) {
        console.log(e);
        console.log(graph_options.sql_command);
        console.log(info.graph_filter);
        console.log(info.graph_filter_items);
    }
    console.log(sql);

    //---------------------------
    var data;
    var xAxis = {
        categories: []
    };
    var series = [];
    var j = 0;
    //---------------------------

    //------------------------------------------------------------------
    //$('div.ui-loader').show();

    $.ajax({
        async: true,
        type: 'POST',
        url: InfoURL,
        timeout: 20000,
        error: function () {
            console.log("ajax error");
            $('#shadow').hide();

            notif.alert('Error!', null, ' ');
            noData(false);
        },
        data: {
            sql: sql,//graph_options.sql_command,
            info: JSON.stringify(info.info),
            db: graph_options.table_name
        }
    }).success(function (msg) {
        //$('div.ui-loader').hide();
        console.log(msg);
        if (msg.length > 2) {
            try {
                data = JSON.parse(msg);
                for (var i in data) {
                    if (i == 'x') {
                        xAxis.categories = data[i];
                    } else {
                        series[j] = {
                            name: i,
                            data: data[i]
                        };


                        j++;
                    }
                }
                buildBarGraph(xAxis, series);
            } finally {
                $('#shadow').hide();
            }
        } else {
            $('#shadow').hide();
            noData(true);

        }
    });
    //------------------------------------------------------------------

}

function buildBarGraph(xAxis, series) {

    console.log("buildBarGraph - params: xAxis = " + xAxis + ", series = " + series);

    var max_w = innerWidth;//$(document).width();
    var max_h = innerHeight;//$(document).height();

    $('#line #container').css('width', max_w * 0.9);
    $('#line #container').css('height', max_h * 0.75);
    options.xAxis.categories = xAxis.categories;
    options.tooltip = {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    };

    buildBarDetails(xAxis, series);


    for (var j  in series) {
        for (var val in series[j].data) {
            series[j].data[val] = parseFloat(series[j].data[val].toString().replace(/,/g, ''));
        }
    }

    options.series = series;
    options.chart.type = 'column';


    //----------------------------------------------------------

    $('#line #container').highcharts(options);

}

function buildBarDetails(xAxis, series) {
    console.log("buildBarDetails - params: xAxis = " + xAxis + ", series = " + series);

    var thead = '<div><h3 style="margin-left: 5px;">' + graph_options.xAxis_text + '</h3></div>';
    var tbody = '';
    var data = [];
    for (var i in series) {
        thead += '<div><h3 style="margin-left: 5px;">' + series[i].name + '</h3></div>';
        for (var j in series[i].data) {
            i = parseInt(i);
            if (i == 0) {
                data[j] = [];
            }
            data[j][0] = xAxis.categories[j];
            data[j][i + 1] = series[i].data[j];
        }
    }


    for (var i in data) {
        tbody += '<div class="order-table">';
        for (var j in data[i]) {
            tbody += '<div><h4>';
            if (j == 0) {
                tbody += '<b>' + data[i][j] + '</b>';
            } else {
                tbody += data[i][j];
            }
            tbody += '</h4></div>';
        }
        tbody += '</div>';
    }

    console.log("thead = " + thead);
    console.log("tbody = " + tbody);

    $('#header-details').html(thead);
    $('#body-details').html(tbody);

    showDetailsPage();
}
