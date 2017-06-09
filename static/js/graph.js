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

/*Y-AXIS*/

var numAttacksByCountry = countryDim.group();
var numAttacksByProvocation = provokeDim.group();

/*Link to HTML*/
var countryChart = dc.barChart("#country-chart");
var provokeChart = dc.pieChart("#provoked-chart");

/*Chart Attributes*/
countryChart
    .width(1000)
    .height(400)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .dimension(countryDim)
    .group(numAttacksByCountry)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .elasticY(false)
    .elasticX(true)
    .xAxisLabel("Country")
    .yAxis().ticks(20);

provokeChart
    .height(220)
    .radius(90)
    .innerRadius(40)
    .transitionDuration(1500)
    .dimension(provokeDim)
    .group(numAttacksByProvocation)
    .legend(dc.legend().x(220).y(0).gap(5));


dc.renderAll();

}