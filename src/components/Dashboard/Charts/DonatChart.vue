<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chartData: {
        labels: this.data.map(c => c.asset),
        datasets: [{
          data: this.data.map(c => c.value.toFixed(2)),
          backgroundColor: this.data.map(c => `#${c.color}`)
        }]
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      }
    })
  }
}
</script>
