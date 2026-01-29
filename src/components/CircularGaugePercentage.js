import React from 'react'
import ReactECharts from 'echarts-for-react'


function CircularGaugePercentage({color = "#00C853", percentage = 75}) {
     const circularProgressBarOptions = {
    series: [
      {
        type: 'pie',
        radius: ['70%', '85%'],
        avoidLabelOverlap: false,
        hoverAnimation: true,
        label: {
          show: true,
          position: 'center',
          fontSize: '25',
          fontWeight: 'bold',
          // formatter: '{d}%'
          formatter: function (params) {
            if (percentage < 50) {
              return `${100.0 - params.value}%`
            } else {
              return `${params.value}%`
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '25',
            fontWeight: 'bold',
            formatter: '{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: `${percentage}`, name: 'Completion', itemStyle: { color: `${color}`, borderRadius: 10 } },
          { value: `${100 - percentage}`, name: 'Remaining', itemStyle: { color: '#FFF' } }
        ]
      }
    ]
  }; 
  return (
    <ReactECharts
      option={circularProgressBarOptions}
      style={{ height: '150px', width: '100%' }}
    />
  )
}

export default CircularGaugePercentage