<template>
  <el-card>
    <div slot="header">
      <el-row>
        <el-col :span="18">
          <p>Cardano (ADA)</p>
        </el-col>
        <el-col :span="6">
          <p class="chart_time-filter">1H</p>
          <p class="chart_time-filter">1D</p>
          <p class="chart_time-filter">1W</p>
          <p class="chart_time-filter selected">1M</p>
          <p class="chart_time-filter">1Y</p>
          <p class="chart_time-filter">ALL</p>
        </el-col>
      </el-row>
    </div>
    <div>
      <line-chart/>
    </div>
  </el-card>
</template>

<script>
import LineChart from '@/components/Dashboard/Charts/LineChart'

export default {
  components: {
    LineChart
  }
}
</script>

<style scoped>
.chart_time-filter {
  float: left;
  opacity: 0.3;
  margin-right: 10px;
}
.chart_time-filter.selected {
  opacity: 1;
}
</style>
