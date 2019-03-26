<!-- Copyright D3 Ledger, Inc. All Rights Reserved. SPDX-License-Identifier: Apache-2.0  -->

<template>
  <div class="echarts">
    <ECharts
      ref="chart"
      :options="chart"
      :auto-resize="true"
      @ready="onReady"
    />
  </div>
</template>

<script>
import currencySymbol from '@/components/mixins/currencySymbol'
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import debounce from 'lodash/fp/debounce'

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
    dateFormat,
    numberFormat
  ],
  data () {
    const fontFamily = "'IBM Plex Sans', sans-serif"

    return {
      chart: {
        grid: {
          top: 10,
          height: 115,
          bottom: 25
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: -1 // render the line behind a symbol
          },
          textStyle: {
            fontFamily
          }
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
            fontFamily
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: (value) => value.toLocaleString().replace(/,/g, ' '), // "12,345" -> "12 345"
            fontFamily,
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

  created () {
    this._adjustYAxisWidthDebounced = debounce(500)(this.adjustYAxisWidth.bind(this))
    window.addEventListener('resize', this._adjustYAxisWidthDebounced)
    this.onReady()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this._adjustYAxisWidthDebounced)
  },

  methods: {
    onReady (instance, ECharts) {
      this.chart.tooltip.formatter = data => {
        const value = numberFormat.filters.formatNumberLong(data[0].value.toFixed(2))
        const time = this.formatDate(data[0].data.time * 1000)
        return `${time}<br/>${value} ${this.currencySymbol}`
      }
      this.chart.xAxis.data = this.data.map(i => this.convertTime(i.time))
      this.chart.series[0].data = this.data.map(i => {
        return { value: i.sum, time: i.time }
      })

      this.$nextTick(this.adjustYAxisWidth)
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
      return this.formatDateWith(date, filterFormat[this.filter])
    },
    adjustYAxisWidth () {
      const chartInstance = this.$refs.chart.chart
      const chartWidth = this.$refs.chart.width
      const maxValue = Math.max.apply(null, this.data.map(i => i.sum))
      const WIDTH_PER_DIGIT = 10
      const OFFSET = 10
      let digits
      if (maxValue > 10) {
        digits = maxValue.toFixed(0).length
      } else if (maxValue > 4) {
        digits = maxValue.toFixed(1).length
      } else if (maxValue > 0.1) {
        digits = maxValue.toFixed(2).length
      } else {
        digits = maxValue.toFixed(3).length
      }
      const yAxisWidth = OFFSET + digits * WIDTH_PER_DIGIT

      chartInstance.setOption({
        grid: {
          left: yAxisWidth,
          width: chartWidth - (yAxisWidth + 20)
        }
      })
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
