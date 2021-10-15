export default function StackedAreaChart(container) {
	// initialization
    // SVG and margin 
    const margin = ({top: 20, right: 20, bottom: 20, left: 50})
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom
    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    // Scaling
    const xScale = d3
        .scaleTime()
        .range([0, width])
    const yScale = d3
        .scaleLinear()
        .range([height, 0])
    const colorScale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
    
    const tooltip = svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("font-size", 13)
      .attr("x",10)
      .attr("y",0);
    
     // Axis 
    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr("transform", "translate(0," + height + ")")

    svg.append('g')
        .attr('class', 'axis y-axis')

    let selected = null, xDomain, data;

	function update(data){
        var key = selected ? [selected] : data.columns.slice(1)
        var stack = d3.stack()
            .keys(key)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)

        var series = stack(data)

        xScale.domain(d3.extent( data,d=>d.date))
        yScale.domain([0,d3.max(series, d => { return d3.max(d, d => d[1])})])
        colorScale.domain(key)

        svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width)
          .attr("height", height)
          
        const area= d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));
        
        const areas = svg.selectAll(".area")
            .data(series, d => {return d.key})
        
        areas.enter() 
            .append("path")
            .attr("class","area")
            .merge(areas)
            .attr("d", area)
            .attr("fill",d => {
                return colorScale(d.key);
            })
            .on("mouseover", (_, d) => tooltip.text(d.key))
            .on("mouseout", _ => tooltip.text(""))
            .on("click", (_, d) => {
              // toggle selected based on d.key
              if (selected === d.key) {
                selected = null;
              } else {
                selected = d.key;
              }
            update(data)
        }) 
        
        areas.exit().remove();
        
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);
        
        svg.select(".x-axis")
        .call(xAxis);
    
        svg.select(".y-axis")
        .call(yAxis);
	}
	return {
		update
	}
}