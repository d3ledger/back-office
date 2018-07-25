<template>
  <div class="echarts">
    <IEcharts
      :option="chart"
      :resizable="true"
      @ready="onReady"
    />
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import format from 'date-fns/format'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  name: 'line-chart-table',
  components: {
    IEcharts
  },
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
    currencySymbol
  ],
  data () {
    return {
      chart: {
        grid: {
          width: '104%',
          height: '85%',
          top: '10%',
          // bottom: '0%',
          left: '-2%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          show: true,
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
      this.chart.series[0].data = this.data.map(i => i.close)
    },
    convertDate (num) {
      const filterFormat = {
        'ALL': 'MMM\'YY',
        '1Y': 'MMM\'YY',
        '1M': 'DD MMM',
        '1W': 'dddd',
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
  height: 432px;
  width: 100%;
}
</style>
