import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import { LineChart } from 'echarts/charts'
import { BarChart } from 'echarts/charts'
import type {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'
import { VisualMapComponent } from 'echarts/components'
import { LegendComponent, TitleComponent, ToolboxComponent } from 'echarts/components'
import { DataZoomComponent } from 'echarts/components'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect } from 'react'

import useReactEcharts from './use-react-echarts'

echarts.use([
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  BarChart,
  DataZoomComponent,
  LineChart,
  ToolboxComponent,
  TitleComponent,
  LegendComponent,
  VisualMapComponent
])

type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

const cloneDeep = a => JSON.parse(JSON.stringify(a))

const DEFAULT_OPTION: ECOption = {
  title: {
    text: 'Hello use-react-echarts.'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最新成交价', '预购队列']
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  grid: {
    top: 70,
    left: 30,
    right: 60,
    bottom: 30
  },
  dataZoom: {
    show: false,
    start: 0,
    end: 100
  },
  visualMap: {
    show: false,
    min: 0,
    max: 1000,
    color: [
      '#BE002F',
      '#F20C00',
      '#F00056',
      '#FF2D51',
      '#FF2121',
      '#FF4C00',
      '#FF7500',
      '#FF8936',
      '#FFA400',
      '#F0C239',
      '#FFF143',
      '#FAFF72',
      '#C9DD22',
      '#AFDD22',
      '#9ED900',
      '#00E500',
      '#0EB83A',
      '#0AA344',
      '#0C8918',
      '#057748',
      '#177CB0'
    ]
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: (function () {
        let now = new Date()
        let res = []
        let len = 50
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
          now = new Date(now - 2000)
        }
        return res
      })()
    },
    {
      type: 'category',
      boundaryGap: true,
      data: (function () {
        let res = []
        let len = 50
        while (len--) {
          res.push(50 - len + 1)
        }
        return res
      })()
    }
  ],
  yAxis: [
    {
      type: 'value',
      scale: true,
      name: '价格',
      max: 20,
      min: 0,
      boundaryGap: [0.2, 0.2],
      nameGap: 25
    },
    {
      type: 'value',
      scale: true,
      name: '预购量',
      max: 1200,
      min: 0,
      boundaryGap: [0.2, 0.2],
      nameGap: 25
    }
  ],
  series: [
    {
      name: '预购队列',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        borderRadius: 4
      },
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return idx * 10
      },
      animationDelayUpdate: function (idx) {
        return idx * 10
      },
      data: (function () {
        let res = []
        let len = 50
        while (len--) {
          res.push(Math.round(Math.random() * 1000))
        }
        return res
      })()
    },
    {
      name: '最新成交价',
      type: 'line',
      data: (function () {
        let res = []
        let len = 0
        while (len < 50) {
          res.push((Math.random() * 10 + 5).toFixed(1) - 0)

          len++
        }
        return res
      })()
    }
  ]
}

const App = () => {
  const [ref, chart] = useReactEcharts({ options: DEFAULT_OPTION })

  useEffect(() => {
    if (!chart) return
    let option = DEFAULT_OPTION
    let count = 52

    const updateChart = () => {
      const axisData = new Date().toLocaleTimeString().replace(/^\D*/, '')
      const newOption = cloneDeep(option) // immutable
      newOption.title.text = 'Hello use-react-echarts.' + new Date().getSeconds()
      const data0 = newOption.series[0].data
      const data1 = newOption.series[1].data

      data0.shift()
      data0.push(Math.round(Math.random() * 1000))
      data1.shift()
      data1.push((Math.random() * 10 + 5).toFixed(1) - 0)

      newOption.xAxis[0].data.shift()
      newOption.xAxis[0].data.push(axisData)
      newOption.xAxis[1].data.shift()
      newOption.xAxis[1].data.push(count++)

      option = newOption
      chart.setOption(option)
    }

    const timer = setInterval(() => {
      updateChart()
    }, 1000)

    return () => clearInterval(timer)
  }, [chart])

  return <div ref={ref} style={{ height: 380, border: '1px solid red' }} />
}

export default App
