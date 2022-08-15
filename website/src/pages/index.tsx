import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import LineChart from '../components/LineChart'
import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className={styles.main}>
        <h1>Installation</h1>
        <CodeBlock language="sh" showLineNumbers>
          pnpm add use-react-echarts -S
        </CodeBlock>
        <h1>Getting Started</h1>

        <CodeBlock language="tsx" showLineNumbers>
          {`import useReactEcharts from 'use-react-echarts'

const LineChart = () => {
  const [ref, chart] = useReactEcharts()

  useEffect(() => {
    if (!chart) return
    chart.setOption({
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
  }, [chart])

  return <div ref={ref} style={{ height: 380 }} />
}`}
        </CodeBlock>

        <h2>Result</h2>
        <LineChart />
      </main>
    </Layout>
  )
}
