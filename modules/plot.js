export function plot(header, width = 300, height = 200)
{
    return new Plot(header, width, height)
}

class Plot
{
    constructor(header, width, height)
    {
        this.header = header;
        this.width = width;
        this.height = height;
        this.url = "../data/test_data.dsv";

        // store previous data
        // used to prevent redrawing the same data.
        this.serializedData = JSON.stringify({});

        // set plot dimentions
        this.margin = { top: 40, right: 20, bottom: 40, left: 40 };
        this.chartWidth = this.width - this.margin.right - this.margin.left;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;

        // Draw the main elements of the chart.
        this._drawChart();

        // prevent issues with 'this' inside the Interval function.
        const updatePlot = d => { return this._update(); }

        // call update function periodically.
        setInterval(function () { updatePlot() }, 2000);

        // perform the first update.
        updatePlot();

    }

    _drawChart()
    {

        // create the parent container.
        const container = document.createElement('div');
        container.id = this.header;
        container.className = "plot";
        document.body.appendChild(container);



        // Draw chart containers svg element.
        this.chartGroup = d3
            .select(container)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        // group element containig the path element that draws the lines.
        const chart = this.chartGroup.append("g").attr("class", "line-plot");

        // Draw header.
        const headerGroup = this.chartGroup
            .append('g')
            .attr('class', 'line-plot-header')
            .attr('transform', `translate(${this.chartWidth * 0.3},${-this.margin.top * 1})`)
            .append('text');

        headerGroup
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '1.5em')
            .text(this.header);

        // create the group for the x axis.
        this.xAxisElement = this.chartGroup
            .append("g")
            .attr("class", "xAxis-container")
            .attr("transform", `translate(0, ${this.chartHeight})`);

        // create the group for the y axis.
        this.yAxisElement = this.chartGroup
            .append("g")
            .attr("class", "yAxis-container");

    }


    _update()
    {
        console.log("updating");
        d3.dsv(" ", "data/test_data.dsv").then(data =>
        {
            if (JSON.stringify(data) !== this.serializedData)
            {
                console.log("new data set");
                // data is serialized before formating
                this.serializedData = JSON.stringify(data);
                for (let index = 0; index < data.length; index++)
                {
                    data[index].sample = +data[index].sample;
                    data[index].value = +data[index].value;
                }
                this._generate(data);

            } else
                console.log("same data values");
        });
    }


    _generate(data) 
    {

        // define x Scale function.
        // scale the x values to the chart size
        const xScale = d3
            .scaleLinear()
            .domain([0, data.length]) // the data range
            .range([0, this.chartWidth]); // the scaled range


        // define y Scale function.
        // scale the y values to the chart size
        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data.map(d => d.value)))
            .range([this.chartHeight, 0]); // flip the coords as the data is display from bottom up.


        // create a Line generator.
        // the d3 line function does not draw lines.
        // returns a function that will create an svg path based on the passed data.
        const lineGen = d3
            .line()
            .x(d => xScale(d.sample))
            .y(d => yScale(d.value));


        // set the xaxis to the bottom then render the xAxis group.
        //const xAxis = d3.axisBottom(xScale).tickValues(xTickValues);
        const xAxis = d3.axisBottom(xScale).ticks(8);
        xAxis(this.xAxisElement);

        // set the yaxis to the left then render the yAxis group.
        const yAxis = d3.axisLeft(yScale);
        yAxis(this.yAxisElement);

        // create horizontal grid
        const xGridlines = d3
            .axisBottom(xScale)
            .ticks(20)
            .tickFormat("")
            .tickSize(this.chartHeight);

        const xGripGroup = this.chartGroup
            .append('g')
            .attr('class', 'grid')
            .call(xGridlines);

        xGridlines(xGripGroup);

        // create vertical grid
        const yGridlines = d3
            .axisLeft(yScale)
            .ticks(20)
            .tickFormat("")
            .tickSize(-this.chartWidth);

        const yGripGroup = this.chartGroup
            .append('g')
            .attr('class', 'grid')
            .call(yGridlines);

        yGridlines(yGripGroup);

        //console.log(lineGen(data));
        //debugger;


        // remove previous path
        this.chartGroup
            .select(".line-plot")
            .select("path")
            .remove();

        console.log(data);

        this.chartGroup
            .select(".line-plot")
            .data([data])
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("d", lineGen);

    }
}

