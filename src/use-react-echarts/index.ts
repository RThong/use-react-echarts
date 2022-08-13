import { ResizeObserver } from '@juggle/resize-observer'
import * as echarts from 'echarts'
import type { RefCallback } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { dispose, handleChartResize } from './helpers'

const useReactEcharts = () => {
  const [, forceUpdate] = useState({})

  const resizeObserverRef = useRef(
    new ResizeObserver(() => {
      handleChartResize(chartRef.current)
    })
  )

  const containerRef = useRef<HTMLElement | null>(null)

  const chartRef = useRef<echarts.ECharts>()

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
  const initEchartsInstance = () => {
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

      dispose(_ele)

      chartRef.current = echarts.init(_ele, undefined, {
        width,
        height
      })
      forceUpdate({})

      handleChartResize(chartRef.current)

      // 在echarts首次动画结束后开始监听resize事件
      chartRef.current.on('finished', () => {
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
    return () => {
      dispose(containerRef.current)
      _temp.disconnect()
    }
  }, [])

  return { getRef, chart: chartRef.current } as const
}

export default useReactEcharts
