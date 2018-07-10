<script>
import { Line } from 'vue-chartjs'
import { format } from 'date-fns'
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
  mounted () {
    this.updateChart()
  },
  methods: {
    updateChart () {
      const symbol = this.getSymbol
      let scales = {
        xAxes: [{
          gridLines: {
            display: true,
            drawTicks: true
          },
          ticks: {
            display: true
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
          borderWidth: 2,
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
        'ALL': 'DD/MM/YYYY',
        '1Y': 'MMMM',
        '1M': 'DD MMMM',
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
