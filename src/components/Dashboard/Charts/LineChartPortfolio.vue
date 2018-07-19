<script>
import { Line } from 'vue-chartjs'
import { format } from 'date-fns'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  extends: Line,
  props: {
    data: {
      type: Array,
      required: false
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
            display: false,
            drawTicks: false
          },
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          stacked: true,
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
          borderWidth: 1,
          backgroundColor: '#fafafa',
          borderColor: '#000000',
          data: this.data.map(i => i.sum),
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
              return `${value.toFixed(2)} ${symbol}`
            }
          }
        },
        scales
      })
    },
    convertDate (num) {
      const date = new Date(num * 1000)
      return format(date, 'DD MMMM')
    }
  }
}
</script>
