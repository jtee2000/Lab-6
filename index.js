import AreaChart from './AreaChart.js'
import StackedAreaChart from './StackedAreaChart.js'

let data
d3.csv("unemployment.csv", d3.autoType).then(res => {
    data = res
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    data.map(item => {
        let shiftedArr = Object.values(item)
        let ct = 0
        shiftedArr.shift() 
        ct += shiftedArr.reduce(reducer)
        item["total"] = ct
        return item
    })
    const areaChart1 = StackedAreaChart(".chart-container-1")
    areaChart1.update(data)
    const areaChart2 = AreaChart(".chart-container-2")
    areaChart2.update(data)   
    areaChart2.on("brushed", (range)=>{
        areaChart1.filterByDate(range) // coordinating with stackedAreaChart
    })  
})


