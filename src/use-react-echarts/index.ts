import { ResizeObserver } from '@juggle/resize-observer'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'

import { dispose, handleChartResize, isFunction } from './helpers'

const useReactEcharts = <T extends HTMLElement = any>(options: echarts.EChartsOption) => {
  // 正常使用echarts是应该通过useRef来使用唯一实例的
  const chartRef = useRef<echarts.ECharts>()

  // 初始的options  通过ref保存
  const initialOptRef = useRef(options)

  // ResizeObserver实例
  const resizeObserverRef = useRef(
    new ResizeObserver(() => {
      handleChartResize(chartRef.current)
    })
  )

  // 图表所绑定的dom元素
  const ref = useRef<T | null>(null)

  // 外部在useEffect中使用就必须在这里用状态保存chart才能让外部感知到echart实例绑定
  const [chart, setChart] = useState<echarts.ECharts>()

  /**
   * https://github.com/hustcc/echarts-for-react/blob/master/src/core.tsx#L88
   * https://github.com/hustcc/echarts-for-react/pull/464
   * 解决初始化实例时，宽高不正确的问题
   * @returns
   */
  const initEchartsInstance = () =>
    new Promise<echarts.ECharts>(resolve => {
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

        _chart.setOption(initialOptRef.current)

        resolve(_chart)
      })
    })

  const handleResize = (val: echarts.ECharts) => {
    const _ele = ref.current
    if (!_ele) {
      return
    }
    const _chart = val
    console.log('【timeout】', _chart.getOption())

    const options = _chart.getOption()

    const _duration = options.animationDuration

    const timeout = options.animation
      ? isFunction(_duration)
        ? 1000
        : (_duration as number) ?? 1000
      : 0

    // 因为直接resize会破坏初始化完成时的动画效果，所以需要延迟一段时间再resize
    const timer = window.setTimeout(() => {
      resizeObserverRef.current.observe(_ele)
    }, timeout)

    return timer
  }

  useEffect(() => {
    let timer: number | undefined
    ;(async () => {
      const _chart = await initEchartsInstance()
      timer = handleResize(_chart)
    })()

    return () => {
      timer && window.clearTimeout(timer)
    }
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
