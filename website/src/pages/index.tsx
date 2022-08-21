import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import LineChart from '../components/LineChart'
import styles from './index.module.css'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Svg = require('@site/static/img/undraw_segmentation_re_gduq.svg').default

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <main className={styles.layout}>
        <div className={styles.introHeader}>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--outline button--info button--lg" to="/simple">
              Demo
            </Link>
          </div>
        </div>

        <Svg role="img" className={styles.svg} />
      </main>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className={clsx(styles.layout, styles.main)}>
        <h1>Install</h1>
        <CodeBlock language="sh" showLineNumbers>
          $ pnpm add use-react-echarts -S
        </CodeBlock>
        <h1>Getting Started</h1>

        <CodeBlock language="tsx" showLineNumbers>
          {`import React from 'react'
import useReactEcharts from 'use-react-echarts'

const LineChart = () => {
  const [ref] = useReactEcharts({
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ],
    tooltip: {
      trigger: 'axis'
    }
  })

  return <div ref={ref} style={{ height: 380 }} />
}

export default LineChart`}
        </CodeBlock>

        <h2>Result</h2>
        <LineChart />
      </main>
    </Layout>
  )
}
