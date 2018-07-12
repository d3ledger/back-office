<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  watch: {
    data () {
      this.updateChart()
    }
  },
  methods: {
    updateChart () {
      this.renderChart({
        labels: this.data.map(c => c.asset),
        datasets: [{
          data: this.data.map(c => c.percent.toFixed(2)),
          backgroundColor: this.data.map(c => `#${c.color}`)
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
              const label = data.labels[tooltipItem.index] || ''
              return `${label} - ${value}%`
            }
          }
        }
      })
    }
  }
}
</script>
