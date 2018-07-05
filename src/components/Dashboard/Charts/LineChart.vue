<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data () {
    return {
      chartData: {
        labels: ['January', 'February'],
        datasets: [{
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20]
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
