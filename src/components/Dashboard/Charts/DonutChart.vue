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
export default {
  name: 'donut-chart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chart: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c}%'
        },
        series: [{
          name: 'Portfolio percent',
          type: 'pie',
          radius: ['70%', '80%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
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
    this.onReady()
  },
  methods: {
    onReady (instance, ECharts) {
      this.chart.series[0].data = this.data.map(a => ({
        value: a.percent.toFixed(2),
        name: a.asset,
        itemStyle: {
          color: `#${a.color}`
        }
      }))
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 190px
}
</style>
