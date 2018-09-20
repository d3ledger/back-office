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

export default {
  name: 'line-chart-portfolio',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mixins: [
    currencySymbol
  ],
  data () {
    return {
      chart: {
        grid: {
          width: '104%',
          height: '100%',
          top: '0%',
          left: '-2%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          show: false,
          data: []
        },
        yAxis: {
          show: false
        },
        series: [{
          type: 'line',
          symbol: 'none',
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
        const date = data[0].axisValue
        return `${date}<br/>${value.toFixed(2)} ${this.currencySymbol}`
      }
      this.chart.xAxis.data = this.data.map(i => this.convertDate(i.time))
      this.chart.series[0].data = this.data.map(i => i.sum)
    },
    convertDate (num) {
      const date = new Date(num * 1000)
      return format(date, 'DD MMMM')
    }
  }
}
</script>

<style scoped>
.echarts {
  height: 190px;
  width: 100%;
}
</style>
