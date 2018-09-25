<template>
  <div class="echarts">
    <ECharts
      :options="chart"
      :auto-resize="true"
      @ready="onReady"
    />
  </div>
</template>

<script>
import format from 'date-fns/format'
import currencySymbol from '@/components/mixins/currencySymbol'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  name: 'line-chart-portfolio',
  props: {
    data: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      required: true
    }
  },
  mixins: [
    currencySymbol,
    dateFormat
  ],
  data () {
    return {
      chart: {
        grid: {
          width: '85%',
          height: 140,
          top: 10,
          left: '15%',
          bottom: 0
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            inside: true,
            showMinLabel: false
          },
          z: 100
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false
          },
          splitLine: {
            show: false
          }
        },
        series: [{
          type: 'line',
          symbolSize: 10,
          showSymbol: false,
          hoverAnimation: false,
          itemStyle: {
            color: '#000000'
          },
          lineStyle: {
            width: 1
          },
          areaStyle: {
            color: '#fafafa'
          },
          data: []
        }]
      }
    }
  },
  watch: {
    data () {
      this.onReady()
    }
  },
  methods: {
    onReady (instance, ECharts) {
      this.chart.tooltip.formatter = data => {
        const value = data[0].value
        const time = this.formatDate(data[0].data.time * 1000)
        return `${time}<br/>${value.toFixed(2)} ${this.currencySymbol}`
      }
      this.chart.xAxis.data = this.data.map(i => this.convertTime(i.time))
      this.chart.series[0].data = this.data.map(i => {
        return { value: i.sum, time: i.time }
      })
    },
    convertTime (num) {
      const filterFormat = {
        '1Y': 'MMM\'YY',
        '1M': 'DD MMM',
        '1W': 'ddd',
        '1D': 'HH:mm',
        '1H': 'HH:mm'
      }
      const date = new Date(num * 1000)
      return format(date, filterFormat[this.filter])
    }
  }
}
</script>

<style scoped>
.echarts {
  height: 150px;
  width: 100%;
}
</style>
