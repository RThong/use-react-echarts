// import type * as echarts from 'echarts'
import { useEffect, useState } from 'react'

import useEcharts from './use-react-echarts'

const App = () => {
  const { getRef, chart } = useEcharts()

  useEffect(() => {
    chart?.setOption(
      {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      },
      true
    )
  }, [chart])

  const [width, setWidth] = useState('300px')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setWidth('100%')
    }, 2000)
  }, [])

  return (
    <>
      <button onClick={() => setVisible(false)}>click</button>
      {visible && <div style={{ height: 300, width, border: '1px solid blue' }} ref={getRef} />}
    </>
  )
}

export default App
