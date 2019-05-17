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
import debounce from 'lodash/fp/debounce'
import dateFormat from '@/components/mixins/dateFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  name: 'LineChartTable',
  mixins: [
    currencySymbol,
    dateFormat
  ],
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
  data () {
    const fontFamily = "'IBM Plex Sans', sans-serif"

    return {
      chart: {
        grid: {
          top: 10,
          height: '80%'
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
        dataZoom: [{
          textStyle: {
            fontFamily,
            color: '#8392A5'
          },
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          dataBackground: {
            areaStyle: {
              color: '#8392A5'
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5'
            }
          },
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          left: 60,
          right: 60
        }, {
          type: 'inside'
        }],
        xAxis: {
          show: true,
          data: [],
          axisLabel: {
            fontFamily
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
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
            formatter: (value) => {
              if (value % 1 !== 0) {
                return value
              }
              return value.toLocaleString().replace(/,/g, ' ')
            },
            fontFamily,
            showMinLabel: false,
            showMaxLabel: false
          },
          splitLine: {
            show: false
          }
        },
        series: [{
          type: 'candlestick',
          symbol: 'none',
          itemStyle: {
            normal: {
              color0: '#ff1339',
              color: '#06b023',
              borderColor0: '#ff1339',
              borderColor: '#06b023'
            }
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
        const value = data[0].value
        const date = this.formatDateLong(value[5] * 1000)
        return `${date} </br>
          Open: ${value[1]} ${this.currencySymbol} </br>
          Close: ${value[2]} ${this.currencySymbol} </br>
          Low: ${value[3]} ${this.currencySymbol} </br>
          High: ${value[4]} ${this.currencySymbol}
        `
      }
      this.chart.xAxis.data = this.data.map(i => this.convertDate(i.time))
      this.chart.series[0].data = this.data.map(i => [i.open, i.close, i.low, i.high, i.time])

      this.$nextTick(this.adjustYAxisWidth)
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
      return this.formatDateWith(date, filterFormat[this.filter])
    },
    adjustYAxisWidth () {
      const chartInstance = this.$refs.chart.chart
      const chartWidth = this.$refs.chart.width
      const maxValue = Math.max.apply(null, this.data.map(i => i.high))
      const WIDTH_PER_DIGIT = 10
      const OFFSET = 10
      let digits
      if (maxValue > 10) {
        digits = maxValue.toFixed(0).length
      } else if (maxValue > 4) {
        digits = maxValue.toFixed(1).length
      } else if (maxValue > 0.2) {
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
  height: 100%;
  width: 100%;
}
</style>
