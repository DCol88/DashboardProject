queue()
    .defer(d3.json, "/GlobalSharkAttacks/attacksList")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {


var ndx = crossfilter(projectsJson)

/*X-AXIS*/
var countryDim = ndx.dimension(function (d) {
    return d["Country"];
});

var provokeDim = ndx.dimension(function (d) {
    return d["Type"];
});

var speciesDim = ndx.dimension(function (d){
    return d["Species"];
});

var yearDim = ndx.dimension(function (d) {
    return d["Year"];
});

var activityDim = ndx.dimension(function (d) {
    return d["Activity"];
});

var selectDim = ndx.dimension(function (d) {
    return d["Country"];
});

var genderDim = ndx.dimension(function (d){
    return d["Sex"];
})

var all = ndx.groupAll();

/*Y-AXIS*/

var numAttacksByCountry = countryDim.group();
var numAttacksByProvocation = provokeDim.group();
var numAttacksBySpecies = speciesDim.group();
var numAttacksByYear = yearDim.group();
var numAttacksByActivity = activityDim.group();
var numAttacksByGender = genderDim.group();

var allDate = ("2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016")


/*IF Statements*/

/*LINE CHART*/

var usaAttacksPerYear = yearDim.group().reduceSum(function (d){
    if (d.Country === 'USA'){
        return 1;
    } else {
        return 0;
    }
});
var ausAttacksPerYear = yearDim.group().reduceSum(function (d){
    if (d.Country === 'AUSTRALIA'){
        return 1;
    } else {
        return 0;
    }
});
var saAttacksPerYear = yearDim.group().reduceSum(function (d){
    if (d.Country === 'SOUTH AFRICA'){
        return 1;
    } else {
        return 0;
    }
});
var otherAttacksPerYear = yearDim.group().reduceSum(function (d){
    if (d.Country.indexOf ['SOUTH AFRICA', 'AUSTRALIA', 'USA'] > -1 ){
        return 0;
    } else {
        return 1;
    }
});
/*######################################################*/

/*STACKED BARCHART*/

var surfAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity === 'Surfing' && d.Country === "USA", "AUSTRALIA", "SOUTH AFRICA") {
        return  1;
    } else {
        return 0
    }
});

var swimAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity === 'Swimming' && d.Country === "USA", "AUSTRALIA", "SOUTH AFRICA") {
        return  1;
    } else {
        return 0
    }
});

var fishAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity === 'Fishing' && d.Country === "USA", "AUSTRALIA", "SOUTH AFRICA") {
        return  1;
    } else {
        return 0
    }
});

var otherAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity.indexOf ['Surfing', 'Swimming', 'Fishing'] > -1 ) {
        return  1;
    } else {
        return 0
    }
});

/*Link to HTML*/
var speciesChart = dc.barChart("#species-chart");
var provokeChart = dc.pieChart("#provoked-chart");
var rowChart = dc.rowChart("#row-chart");
var attacksPerYearByCountryChart = dc.compositeChart("#attacks-per-year");
var numberAttacksND = dc.numberDisplay("#number-attacks-nd");
var activityChart = dc.barChart("#activity-chart");
var genderChart = dc.pieChart("#gender-chart");

 

/*Chart Scales*/
// First we get the width of the ID element from the DOM.
	// This is done below using the ID your biggest chart, which
	// in this case spans the entire width of the website.
	// In this case the name of the ID is time-chart, use the ID
	// name of one of your charts.
	// That number gets store in chart_height_element.
	// Then we get the property info of that element with
	// getBoundingClientRect() (get the rectangle properties basically)
	// After that getting the width and the height is easy, and
	// we store those values on chart_height and chart_width respectively.

	chart_height_element = document.getElementById('species-chart');
    positionInfo = chart_height_element.getBoundingClientRect();
    chart_height = positionInfo.height;
    chart_width = positionInfo.width;

	// We do the same for pie charts, as they are different in size.

    pie_height_element = document.getElementById('provoked-chart');
    pie_position_info = pie_height_element.getBoundingClientRect();
    pie_height = pie_position_info.height;
    pie_width = pie_position_info.width;

    // Define chart properties, using chart_width and chart_height.
	// Those basicallya account to numbers (you can console_log them
	// to check the value returned, in pixels.

    timeChart
        .width(chart_width)
        .height(chart_height)

/*Chart Attributes*/
selectField = dc.selectMenu('#menu-select')
       .dimension(selectDim)
       .group(numAttacksByCountry);

speciesChart
    .width(1000)
    .height(400)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .dimension(speciesDim)
    .group(numAttacksBySpecies)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .y(d3.scale.log().clamp(false).domain([0,25]))
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .elasticX(true)
    .xAxisLabel("Species");
    

provokeChart
    .height(220)
    .width(400)
    .radius(90)
    .innerRadius(40)
    .transitionDuration(1500)
    .dimension(provokeDim)
    .group(numAttacksByProvocation)
    .cap(2)
    .ordering( function(d) { return -1.0 * +d.value; })
    .legend(dc.legend().x(300).y(0).gap(5));
   

rowChart
    .width(1000)
    .height(400)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .dimension(countryDim)
    .group(numAttacksByCountry)
    .transitionDuration(500)
    .x(d3.scale.linear())
    .cap(5)
    /*.y(d3.scale.log().clamp(true).domain([0,500]))*/
    /*.xUnits(dc.units.ordinal)*/
    /*.elasticY(true)*/
    .elasticX(true);
    /*.yAxisLabel("Country");*/

attacksPerYearByCountryChart
    .width(990)
    .height(200)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .x(d3.scale.ordinal().domain([allDate]))
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .yAxisLabel("Num of Attacks")
    .xAxisLabel("Year")
    .legend(dc.legend().x(80).y(120).itemHeight(13).gap(5))
    .renderHorizontalGridLines(true)
    .compose([
            dc.lineChart(attacksPerYearByCountryChart)
                .dimension(yearDim)
                .colors('green')
                .group(usaAttacksPerYear, 'USA'),
            dc.lineChart(attacksPerYearByCountryChart)
                .dimension(yearDim)
                .colors('red')
                .group(ausAttacksPerYear, 'AUSTRALIA'),
            dc.lineChart(attacksPerYearByCountryChart)
                .dimension(yearDim)
                .colors('blue')
                .group(saAttacksPerYear, 'SOUTH AFRICA'),
            dc.lineChart(attacksPerYearByCountryChart)
                .dimension(yearDim)
                .colors('black')
                .group(otherAttacksPerYear, 'OTHER')
        ])
    .brushOn(true);

activityChart
    .width(800)
    .height(300)
    .dimension(countryDim)
    .group(surfAttacksByCountry, "Surfing")
    .stack(swimAttacksByCountry, "Swimming")
    .stack(fishAttacksByCountry, "Fishing")
    .stack(otherAttacksByCountry, "Other")
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .legend(dc.legend().x(580).y(80).itemHeight(13).gap(5));


genderChart
    .height(220)
    .width(400)
    .radius(90)
    .innerRadius(40)
    .transitionDuration(1500)
    .dimension(genderDim)
    .group(numAttacksByGender)
    .cap(2)
    .ordering( function(d) { return -1.0 * +d.value; })
    .legend(dc.legend().x(300).y(0).gap(5));


numberAttacksND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);


dc.renderAll();


var resizeTimer;

    $(window).on('resize', function(e) {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

        timeChart
            .width(chart_width)
            .height(chart_height);
        scatterTweets
            .width(chart_width)
            .height(chart_height);
        uniqueTweetsChart
            .width(chart_width)
            .height(chart_height);

        window.location.reload();
                
    }, 250);

    });
}