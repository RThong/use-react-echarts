import React, { useEffect } from 'react'
import useReactEcharts from 'use-react-echarts'

const LineChart = () => {
  const [ref, chart] = useReactEcharts()

  useEffect(() => {
    if (!chart) return
    chart.setOption({
      grid: { top: 8, right: 8, bottom: 24, left: 36 },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ],
      tooltip: {
        trigger: 'axis'
      }
    })
  }, [chart])

  return <div ref={ref} style={{ height: 380 }} />
}

export default LineChart
