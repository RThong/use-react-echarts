import type * as echartsWithAll from 'echarts'
import type * as coreEcharts from 'echarts/core'
import type { ECBasicOption } from 'echarts/types/dist/shared'

export type ReactEchartsOptions = ECBasicOption & {
  echarts?: typeof coreEcharts
}

export type CurrentEcharts<U = ReactEchartsOptions['echarts']> = U extends undefined
  ? typeof echartsWithAll
  : typeof coreEcharts

export type CurrentEchartsInstance<U = ReactEchartsOptions['echarts']> = U extends undefined
  ? echartsWithAll.ECharts
  : coreEcharts.ECharts

export const handleChartResize = (
  chart: CurrentEchartsInstance<ReactEchartsOptions['echarts']> | undefined
) => {
  if (!chart) {
    return
  }
  chart.resize({
    width: 'auto',
    height: 'auto'
  })
}

export const dispose = (
  ele: HTMLElement | null,
  echarts: CurrentEcharts<ReactEchartsOptions['echarts']> | undefined
) => {
  ele && echarts?.dispose(ele)
}

export function isFunction<T>(v: T): T extends (...args: any[]) => infer Res ? true : false
export function isFunction(v: unknown) {
  return typeof v === 'function'
}
