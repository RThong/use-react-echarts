import { ResizeObserver } from '@juggle/resize-observer'
import type * as echartsWithAll from 'echarts'
import type * as coreEcharts from 'echarts/core'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { CurrentEcharts, CurrentEchartsInstance } from './helpers'
import { getInitAnimationDuration } from './helpers'
import { dispose, handleChartResize, isFunction } from './helpers'

function useReactEcharts<T extends HTMLElement = any>(props: {
  options: ECBasicOption
  echarts: typeof coreEcharts
}): [MutableRefObject<T | null>, coreEcharts.ECharts]

function useReactEcharts<T extends HTMLElement = any>(props: {
  options: ECBasicOption
}): [MutableRefObject<T | null>, echartsWithAll.ECharts]

function useReactEcharts<T extends HTMLElement = any>(props: {
  options: ECBasicOption
  echarts?: typeof coreEcharts
}) {
  const { options, echarts } = props

  // 全局的echarts，由外部传入或者内部动态引入
  const echartsRef = useRef<CurrentEcharts | undefined>(echarts)

  // 正常使用echarts应该通过useRef来使用唯一实例的
  const chartRef = useRef<CurrentEchartsInstance>()

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
  const [chart, setChart] = useState<CurrentEchartsInstance>()

  /**
   * https://github.com/hustcc/echarts-for-react/blob/master/src/core.tsx#L88
   * https://github.com/hustcc/echarts-for-react/pull/464
   * 解决初始化实例时，宽高不正确的问题
   * @returns
   */
  const initEchartsInstance = () =>
    new Promise<CurrentEchartsInstance>(resolve => {
      const _echarts = echartsRef.current as CurrentEcharts

      const _ele = ref.current
      if (!_ele) {
        return
      }
      _echarts.init(_ele)

      // 创建一个临时的echarts实例，用于获取实际的宽高
      // `as coreEcharts.ECharts` for type detection
      const echartsInstance = _echarts.getInstanceByDom(_ele) as coreEcharts.ECharts

      echartsInstance?.on('finished', () => {
        const width = _ele.clientWidth
        const height = _ele.clientHeight

        dispose(_ele, _echarts)

        chartRef.current = _echarts.init(_ele, undefined, {
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

  /**
   * 当没有传入echarts时，动态加载echarts
   * @returns
   */
  const getEcharts = async () => {
    if (echartsRef.current) {
      return
    }

    echartsRef.current = (await import('echarts')) as typeof echartsWithAll
  }

  const handleResize = (val: CurrentEchartsInstance) => {
    const _ele = ref.current
    const _chart = val

    if (!_ele || _chart.isDisposed()) {
      return
    }

    const _duration = getInitAnimationDuration(_chart)

    // 因为直接resize会破坏初始化完成时的动画效果，所以需要延迟一段时间再resize
    const timer = window.setTimeout(() => {
      resizeObserverRef.current.observe(_ele)
      // 凑数，为了让动画效果结束后再绑定监听回调，否则会破坏动画
    }, _duration)

    return timer
  }

  useEffect(() => {
    let timer: number | undefined
    ;(async () => {
      await getEcharts()
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
    const _echarts = echartsRef.current
    return () => {
      dispose(_ele, _echarts)
      _temp.disconnect()
    }
  }, [])

  return [ref, chart]
}

export default useReactEcharts
