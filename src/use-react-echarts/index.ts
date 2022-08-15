import { ResizeObserver } from '@juggle/resize-observer'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'

import { dispose, handleChartResize } from './helpers'

const useReactEcharts = <T extends HTMLElement = any>() => {
  const resizeObserverRef = useRef(
    new ResizeObserver(() => {
      handleChartResize(chartRef.current)
    })
  )

  const ref = useRef<T | null>(null)

  // 正常使用echarts是应该通过useRef来使用唯一实例的
  const chartRef = useRef<echarts.ECharts>()

  // 外部在useEffect中使用就必须在这里用状态保存chart才能让外部感知到echart实例绑定
  const [chart, setChart] = useState<echarts.ECharts>()

  /**
   * https://github.com/hustcc/echarts-for-react/blob/master/src/core.tsx#L88
   * https://github.com/hustcc/echarts-for-react/pull/464
   * 解决初始化实例时，宽高不正确的问题
   * @returns
   */
  const initEchartsInstance = () => {
    const _ele = ref.current
    if (!_ele) {
      return
    }
    echarts.init(_ele)

    // 创建一个临时的echarts实例，用于获取实际的宽高
    const echartsInstance = echarts.getInstanceByDom(_ele)

    echartsInstance?.on('finished', () => {
      const width = _ele.clientWidth
      const height = _ele.clientHeight

      dispose(_ele)

      chartRef.current = echarts.init(_ele, undefined, {
        width,
        height
      })

      const _chart = chartRef.current

      // 重新渲染，并将chart实例更新到state中让外部可以获取到
      setChart(_chart)

      handleChartResize(_chart)

      // 在echarts首次动画结束后开始监听resize事件
      _chart.on('finished', () => {
        // 多次监听同一个element不会有影响
        resizeObserverRef.current.observe(_ele)
      })
    })
  }

  useEffect(() => {
    initEchartsInstance()
  }, [])

  useEffect(() => {
    const _temp = resizeObserverRef.current
    const _ele = ref.current
    return () => {
      dispose(_ele)
      _temp.disconnect()
    }
  }, [])

  return [ref, chart] as const
}

export default useReactEcharts
