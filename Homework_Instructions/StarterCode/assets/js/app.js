
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var XAxis = "age";
var YAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, XAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[XAxis]) * 0.8,
        d3.max(censusData, d => d[XAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// Create y scale function
// function used for updating y-scale var upon click on axis label
function yScale(censusData, YAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[YAxis]) * 0.8,
        d3.max(censusData, d => d[YAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

// function used for updating circles group with new tooltip
function updateToolTip(XAxis, YAxis, $circlesSel) {

    if (XAxis === "age") {
        var xlabel = "Age (Median)";
    }
    else if (YAxis === "smokes") {
        var ylabel = "Smokers (%)";
    }

    var $toolTip = d3.select("#scatter").append("div")
        .attr("class", "d3-tip");

    $circlesSel.on("mouseover", function (d, i) {
        $toolTip.style("display", "block");
        $toolTip.html(`${d.state} <br> ${xlabel}:${XAxis]} < br > ${ ylabel }: ${ d[YAxis]}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    })
        .on("mouseout", function () {
            $toolTip.style("display", "none");
        });
    return $circlesSel;
}


// Retrieve data from the CSV file and execute everything below

//d3.csv("assets/data/data.csv", function(censusData) {
function successfunction(censusData) {

    console.log(censusData);

    // parse data
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.abbr = data.abbr;
        data.state = data.state;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, XAxis);

    
    // yLinearScale function above csv import
    var yLinearScale = yScale(censusData, YAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        // .classed("x-axis", true)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);



    // append initial circles
    var $circlesSel = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[XAxis]))
        .attr("cy", d => yLinearScale(d[YAxis]))
        .attr("r", 10)
        .classed('stateCircle', true)
    
    var $textSel = chartGroup.selectAll("text.stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed('stateText', true)
        .attr("x", d => xLinearScale(d[XAxis]))
        .attr("y", d => yLinearScale(d[YAxis]) + 3)
        .text(d => d.abbr)
        
    // updateToolTip function above csv import
    var $circlesSel = updateToolTip(XAxis, YAxis, $circlesSel);
}

d3.csv("assets/data/data.csv").then(successfunction);
