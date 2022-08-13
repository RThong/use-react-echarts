import * as echarts from 'echarts'
import type { RefCallback } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const useReactEcharts = () => {
  const [, forceUpdate] = useState({})

  const containerRef = useRef<HTMLElement | null>()

  const chartRef = useRef<echarts.ECharts>()

  // resize回调，用于解绑事件
  const resizeCbRef = useRef<() => void>()

  const bindResize = () => {
    const chart = chartRef.current
    if (!chart) {
      return
    }
    resizeCbRef.current = () => {
      chart.resize({
        width: 'auto',
        height: 'auto'
      })
    }

    window.addEventListener('resize', resizeCbRef.current)
  }

  const getRef: RefCallback<HTMLElement> = useCallback(val => {
    if (!val || chartRef.current) {
      return
    }
    containerRef.current = val
  }, [])

  /**
   * https://github.com/hustcc/echarts-for-react/blob/master/src/core.tsx#L88
   * https://github.com/hustcc/echarts-for-react/pull/464
   * 解决初始化实例时，宽高不正确的问题
   * @returns
   */
  const initEchartsInstance = () =>
    new Promise(resolve => {
      const _ele = containerRef.current
      if (!_ele) {
        return
      }
      echarts.init(_ele)

      // 创建一个临时的echarts实例，用于获取实际的宽高
      const echartsInstance = echarts.getInstanceByDom(_ele)

      echartsInstance?.on('finished', () => {
        const width = _ele.clientWidth
        const height = _ele.clientHeight

        echarts.dispose(_ele)

        chartRef.current = echarts.init(_ele, undefined, {
          width,
          height
        })
        forceUpdate({})
        resolve(chartRef.current)
      })
    })

  useEffect(() => {
    initEchartsInstance().then(() => {
      bindResize()
    })
  }, [])

  useEffect(() => {
    return () => {
      const _ele = containerRef.current
      _ele && echarts.dispose(_ele)
      resizeCbRef.current && window.removeEventListener('resize', resizeCbRef.current)
    }
  }, [])

  return { getRef, chart: chartRef.current } as const
}

export default useReactEcharts
