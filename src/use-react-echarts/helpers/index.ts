import * as echarts from 'echarts'

export const handleChartResize = (chart: echarts.ECharts | undefined) => {
  if (!chart) {
    return
  }
  chart.resize({
    width: 'auto',
    height: 'auto'
  })
}

export const dispose = (ele: HTMLElement | null) => {
  ele && echarts.dispose(ele)
}
