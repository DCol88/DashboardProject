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

/*Y-AXIS*/

var numAttacksByCountry = countryDim.group();
var numAttacksByProvocation = provokeDim.group();
var numAttacksBySpecies = speciesDim.group();

/*Link to HTML*/
var speciesChart = dc.barChart("#species-chart");
var provokeChart = dc.pieChart("#provoked-chart");
var rowChart = dc.rowChart("#row-chart");

/*Chart Attributes*/
speciesChart
    .width(1000)
    .height(400)
    .margins({top:10, right: 50, bottom:80, left: 50})
    .dimension(speciesDim)
    .group(numAttacksBySpecies)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .y(d3.scale.log().clamp(true).domain([0,500]))
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
    .elasticX(true)
    /*.yAxisLabel("Country");*/


dc.renderAll();

}