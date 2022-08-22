# use-react-echarts

React hooks for Apache Echarts.

[![License](https://img.shields.io/npm/l/use-react-echarts.svg)](https://www.npmjs.com/package/use-react-echarts)
![ECharts Ver](https://img.shields.io/badge/echarts-v5.0.0-blue)
![React Ver](https://img.shields.io/badge/React-v17.0.0-blue)

## Install

```bach
$ pnpm add use-react-echarts -S

# `echarts` is the peerDependence of `use-react-echarts`, you can install echarts with your own version.
$ pnpm add echarts -S
```

## Usage

### 1. Basic usage

```ts
import useReactEcharts from 'use-react-echarts';

// This will import all the charts and components in ECharts
const [ref, chart] = useReactEcharts({ options })

// Only import required charts and components 
const [ref, chart] = useReactEcharts({ echarts, ...option })
```

- **`option`**
The echarts [option config](https://echarts.apache.org/option.html#title).


- **`echarts`**
For minimal bundle of echarts. By default, `use-react-echarts` import all the charts and components in ECharts.You can pass the echarts props with the required Echarts modules to reduce bundle size

### 2. Import ECharts modules manually to reduce bundle size

```tsx
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import { BarChart, LineChart } from 'echarts/charts'
import type {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect } from 'react'

import useReactEcharts from 'use-react-echarts'

// Register the required components
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

const App = () => {
  const [ref, chart] = useReactEcharts({ echarts, options})

  return <div ref={ref} style={{ height: 380 }} />
}
```

Please read [import-echarts](https://echarts.apache.org/handbook/en/basics/import/#import-echarts) for more details.

## Result

- **`ref`**
Echarts instance container, usually is a element.


- **`chart`**
The echarts instance object, then you can use any API of echarts.
For example:
```tsx
const [ref, chart] = useReactEcharts({ options })

useEffect(() => {
  if(!chart) return
  chart.setOption(option)
}, [chart])

return <div ref={ref} style={{ height: 380 }} >

```

About API of echarts, can see https://echarts.apache.org/api.html#echartsInstance.




## LICENSE

MIT@[Hong](https://github.com/RThong).


