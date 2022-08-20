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

export function isFunction<T>(v: T): T extends (...args: any[]) => infer Res ? true : false
export function isFunction(v: unknown) {
  return typeof v === 'function'
}
