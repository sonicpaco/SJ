const privateComponents =
{
    url: "",
    header: "",
    width: 500,
    height: 300,
    xPos: 0,
    tPos: 0
}

export function plot(url, header = url)
{
    return new Plot(url, header);
}


function Plot(url, header)
{
    let component = Object.create(privateComponents);
    this.url = url
    this.header = header;

    this.setSize = function (width, height)
    {
        component.width = width;
        component.height = height;
    }

    this.setPosition = function (x, y)
    {
        component.xPos = x;
        component.yPos = y;
    }

    Object.defineProperty(this, 'height',
        { get: function () { return component.height; } }
    );

    Object.defineProperty(this, 'width',
        { get: function () { return component.width; } }
    );
}

Plot.prototype.generate = function ()
{

    // set plot dimentions
    const margin = { top: 80, right: 60, bottom: 40, left: 60 };
    const width = this.width - margin.right - margin.left;
    const height = this.height - margin.top - margin.bottom;


    let buffer = {};

    // create the parent container.
    const container = document.createElement('div');
    container.id = this.header;
    container.className = "plot";
    document.body.appendChild(container);



    // Draw chart containers elements.
    const chartGroup = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Draw header.
    const header = chartGroup
        .append('g')
        .attr('class', 'line-plot-header')
        .attr('transform', `translate(0,${-margin.top * 0.6})`)
        .append('text');

    header
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .text(this.header);



    // create the group for the x axis.
    const xAxisElement = chartGroup
        .append("g")
        .attr("class", "xAxis-container")
        .attr("transform", `translate(0, ${height})`);

    // create the group for the y axis.
    const yAxisElement = chartGroup
        .append("g")
        .attr("class", "yAxis-container");


    // group element containig the path element that draws the lines.
    const chart = chartGroup.append("g").attr("class", "line-plot");


    const url = `data/${this.url}`;

    // Retreive the data.
    // compare to the previous data
    // do nothing if the data has not changed

    setInterval(function ()
    {
        d3.dsv(" ", url).then(data =>
        {
            for (let index = 0; index < data.length; index++)
            {
                data[index].sample = +data[index].sample;
                data[index].value = +data[index].value;
            }
            //compare the data
            if (buffer.length === data.length && JSON.stringify(data) === JSON.stringify(buffer))
                console.log("same data values");
            else
            {
                console.log("new data set");
                buffer = data;
                renderChart(data);
            }
        });
    }, 2000);



    function renderChart(data)
    {
        //debugger;

        //debugger;


        // create a Line generator.
        // the d3 line function does not draw lines.
        // returns a function that will create an svg path based on the passed data.
        const lineGen = d3
            .line()
            .x(d => xScale(d.sample))
            .y(d => yScale(d.value));

        // define x Scale function.
        // scale the x values to the chart size
        const xScale = d3
            .scaleLinear()
            .domain([0, data.length]) // the data range
            .range([0, width]); // the scaled range


        // define y Scale function.
        // scale the y values to the chart size
        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data.map(d => d.value)))
            .range([height, 0]); // flip the coords as the data is display from bottom up.


        // array to set xticks values.
        // const xTickValues = data.map(d => d.sample);

        // set the xaxis to the bottom then render the xAxis group.
        //const xAxis = d3.axisBottom(xScale).tickValues(xTickValues);
        const xAxis = d3.axisBottom(xScale);
        xAxis(xAxisElement);

        // set the yaxis to the left then render the yAxis group.
        const yAxis = d3.axisLeft(yScale);
        yAxis(yAxisElement);


        // create horizontal grid
        const xGridlines = d3
            .axisBottom(xScale)
            .ticks(20)
            .tickFormat("")
            .tickSize(height);

        const xGripGroup = chartGroup
            .append('g')
            .attr('class', 'grid')
            .call(xGridlines);

        xGridlines(xGripGroup);

        // create vertical grid
        const yGridlines = d3
            .axisLeft(yScale)
            .ticks(20)
            .tickFormat("")
            .tickSize(-width);

        const yGripGroup = chartGroup
            .append('g')
            .attr('class', 'grid')
            .call(yGridlines);

        yGridlines(yGripGroup);





        //console.log(lineGen(data));
        //debugger;

        // remove previous path
        chartGroup
            .select(".line-plot")
            .select("path")
            .remove();

        chartGroup
            .select(".line-plot")
            .data([data])
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("d", lineGen);
    }


    // function drawPlot()
    // {

    // }





}
