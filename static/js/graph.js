queue()
    .defer(d3.json, "/GlobalSharkAttacks/attacksList")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {


var ndx = crossfilter(projectsJson);

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

var all = ndx.groupAll();

/*Y-AXIS*/

var numAttacksByCountry = countryDim.group();
var numAttacksByProvocation = provokeDim.group();
var numAttacksBySpecies = speciesDim.group();
var numAttacksByYear = yearDim.group();
var numAttacksByActivity = activityDim.group();

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
    if (d.Activity === 'Surfing') {
        return  1;
    } else {
        return 0
    }
});

var swimAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity === 'Swimming') {
        return  1;
    } else {
        return 0
    }
});

var fishAttacksByCountry = countryDim.group().reduceSum(function (d) {
    if (d.Activity === 'Fishing') {
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

 

/*Color Scales*/


/*Chart Attributes*/
speciesChart
    .width(1000)
    .height(400)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .dimension(speciesDim)
    .group(numAttacksBySpecies)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .y(d3.scale.log().clamp(false).domain([0,50]))
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
    .x(d3.time.scale().domain([2005,2016]))
    /*.xUnits(dc.units.ordinal)*/
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


numberAttacksND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);


dc.renderAll();

}