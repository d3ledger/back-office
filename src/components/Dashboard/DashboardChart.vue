<template>
  <div class="card-content shadow">
    <div class="card-content_header">
      <el-row class="card-content_header-row">
        <el-col :span="14">
          <p>
            {{ portfolioChart.crypto }}
          </p>
        </el-col>
        <el-col :span="10" class="card-content_header-filters">
          <p
            v-for="(value, index) in daysLabels"
            :key="index"
            :class="[portfolioChart.filter !== value ? 'chart_time-filter' : 'chart_time-filter selected']"
            @click="selectLabel(value)">
            {{ value }}
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="card-content_body">
      <line-chart-table :data="portfolioChart.data" :filter="portfolioChart.filter"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'

export default {
  components: {
    LineChartTable: lazyComponent('Dashboard/Charts/LineChartTable')
  },
  data () {
    return {
      daysLabels: ['1H', '1D', '1W', '1M', '1Y', 'ALL']
    }
  },
  computed: {
    ...mapGetters([
      'portfolioChart'
    ])
  },
  methods: {
    selectLabel (label) {
      this.$store.dispatch('getPriceByFilter', { filter: label })
    }
  }
}
</script>

<style scoped>
.card-content {
  color: #303133;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  min-height: 500px;
  transition: .3s;
  -webkit-transition: .3s;
}

.card-content.shadow {
  -webkit-box-shadow: 5px 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 5px 2px 12px 0 rgba(0,0,0,.1);
}

.card-content_header {
  border-bottom: 1px solid #f5f5f5
}

.card-content_header > .card-content_header-row {
  padding: 1.5rem;
}

.card-content_header-filters {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
}

.chart_time-filter {
  float: left;
  opacity: 0.3;
  margin-right: 10px;
}
.chart_time-filter {
  cursor: pointer;
}
.chart_time-filter.selected {
  opacity: 1;
  font-weight: 600;
  border-bottom: 2px solid #000000;
}
</style>
