$(document).ready(function() {
  var convertToFahrenheit = function(celsius) {
    return celsius * 1.8 + 32;
  };

  var renderGraph = function(datapoints) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
      .range([0, width]);
    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    x.domain(d3.extent(datapoints, function(d) { return d.timestamp; }));
    y.domain(d3.extent(datapoints, function(d) { return convertToFahrenheit(d.reading); }));

    var line = d3.svg.line()
      .x(function(d) { return x(d.timestamp); })
      .y(function(d) { return y(convertToFahrenheit(d.reading)); });

    d3.select("#temperature-graph svg").remove();

    var svg = d3.select("#temperature-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature");
    svg.append("path")
      .datum(datapoints)
      .attr("class", "line")
      .attr("d", line);
  };

  var showSummary = function(datapoints, precision) {
    var latest = datapoints[datapoints.length - 1];

    var celsius = latest.reading;
    $("#temperature-current-celsius").text(celsius.toPrecision(precision));

    var fahrenheit = convertToFahrenheit(latest.reading);
    $("#temperature-current-fahrenheit").text(fahrenheit.toPrecision(precision));

    $("#temperature-current-timestamp").text(latest.timestamp);
  };

  var loadData = function(config) {
    console.log("Loading data", config);

    d3.json(config.apiUrl)
      .header("x-api-key", config.apiKey)
      .get(function(error, json) {
        if (error) {
          throw error;
        }

        var datapoints = [];
        json.Datapoints.forEach(function(d) {
          datapoints.push({
            reading: d.Average,
            timestamp: d3.time.format.iso.parse(d.Timestamp)
          });
        });

        datapoints.sort(function(a, b) {
          if (a.timestamp < b.timestamp) {
            return -1;
          }

          if (a.timestamp > b.timestamp) {
            return 1;
          }

          return 0;
        });

        renderGraph(datapoints);
        showSummary(datapoints, config.precision);
      });
  };

  var init = function() {
    var defaults = {
      precision: 5,
      refreshInterval: 300
    };

    $.getJSON("home-dashboard.json", function(config) {
      config = $.extend({}, defaults, config);

      var load = function() { loadData(config) };

      load();
      window.setInterval(load, config.refreshInterval * 1000);
      $("#reload").on("click", load);
    });
  };

  init();
});
