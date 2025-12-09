class LineChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 700,
      containerHeight: _config.containerHeight || 250,
      margin: { top: 50, right: 20, bottom: 40, left: 70 },
      tooltipPadding: _config.tooltipName || 15,
    };

    this.data = _data;

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.chart = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight)
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
      );

    vis.xScale = d3.scaleTime().range([0, vis.width]);

    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.timeFormat("%Y"));
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(5);

    vis.xAxisGroup = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${vis.height})`);

    vis.yAxisGroup = vis.chart.append("g").attr("class", "axis y-axis");

    vis.chart
      .append("text")
      .attr("class", "axis-title")
      .attr("y", vis.height + 25)
      .attr("x", 300)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Year");

    vis.chart
      .append("text")
      .attr("class", "axis-title")
      .attr("y", -50)
      .attr("x", -vis.height + 30)
      .attr("dy", ".71em")
      .attr("transform", `rotate(-90)`)
      .text("Exoplanets Discovered");

    vis.chart
      .append("text")
      .attr("class", "chart-title")
      .attr("y", -20)
      .attr("x", 250)
      .attr("dy", ".71em")
      .text("Exoplanets Discovered by Year");
  }

  updateVis() {
    let vis = this;

    vis.values = Array.from(
      d3.rollup(
        vis.data,
        (d) => d.length,
        (d) => d.disc_year
      )
    ).sort((x, y) => x[0] - y[0]);

    vis.xValue = (d) => new Date(`${d[0]}-01-01T00:00:00`);
    vis.yValue = (d) => d[1];

    vis.line = d3
      .line()
      .x((d) => vis.xScale(vis.xValue(d)))
      .y((d) => vis.yScale(vis.yValue(d)));

    vis.xScale.domain(d3.extent(vis.values.map((d) => vis.xValue(d))));

    vis.yScale.domain([0, d3.max(vis.values, (d) => vis.yValue(d))]).nice();

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    vis.chart.selectAll("path").remove();

    vis.chart
      .append("path")
      .data([vis.values])
      .attr("class", "chart-line")
      .attr("stroke", "#4FB062")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("d", (d) => vis.line(d));

    vis.xAxisGroup.call(vis.xAxis);
    vis.yAxisGroup.call(vis.yAxis);
  }
}
