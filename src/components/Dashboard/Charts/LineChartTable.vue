<script>
import { Line } from 'vue-chartjs'
import format from 'date-fns/format'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  extends: Line,
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
  watch: {
    data () {
      this.updateChart()
    }
  },
  methods: {
    updateChart () {
      const symbol = this.currencySymbol
      let scales = {
        xAxes: [{
          gridLines: {
            display: true,
            drawTicks: true
          },
          ticks: {
            display: true,
            autoSkip: true,
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          gridLines: {
            display: true,
            drawTicks: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }]
      }

      this.renderChart({
        labels: this.data.map(i => this.convertDate(i.time)),
        datasets: [{
          bezierCurve: false,
          lineTension: 0,
          backgroundColor: '#fafafa',
          borderColor: '#000000',
          borderWidth: 1,
          data: this.data.map(i => i.close),
          pointRadius: 0,
          pointHitRadius: 10
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const value = data.datasets[0].data[tooltipItem.index] || 0
              return `${value} ${symbol}`
            }
          }
        },
        scales
      })
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
