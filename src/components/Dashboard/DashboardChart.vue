<template>
  <div class="card-content shadow">
    <div class="card-content_header">
      <el-row class="card-content_header-row">
        <el-col :span="14">
          <p class="card-content_header-title">
            {{ portfolioChart.crypto }}
          </p>
        </el-col>
        <el-col
          :span="10"
          class="card-content_header-filters">
          <div
            v-for="(value, index) in daysLabels"
            :key="index"
            :class="[portfolioChart.filter !== value ? 'chart_time-filter' : 'chart_time-filter selected']"
            @click="selectLabel(value)">
            <p class="chart_time-filter_value">{{ value }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      v-loading="portfolioChart.isLoading"
      :style="{ height: `${dashboardChartHeight + 30}px` }"
      class="card-content_body">
      <line-chart-table
        :data="portfolioChart.data"
        :filter="portfolioChart.filter"/>
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
  props: {
    dashboardChartHeight: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      daysLabels: ['1H', '1D', '1W', '1M', '1Y']
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
.card-content_header {
  border-bottom: 1px solid #f5f5f5
}

.card-content_header > .card-content_header-row {
  padding: 0rem;
}

.card-content_header-title {
  padding: 1rem;
}

.card-content_header-filters {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
}

.card-content_body {
  height: 100%;
}

.chart_time-filter {
  justify-content: center;
  opacity: 0.3;
  padding: 1rem;
  cursor: pointer;
}
.chart_time-filter.selected {
  opacity: 1;
  font-weight: 600;
  background-color: #f5f5f5;
  border-bottom: 2px solid #000000;
}
</style>
