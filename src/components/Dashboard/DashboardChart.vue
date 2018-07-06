<template>
  <el-card>
    <div slot="header">
      <el-row>
        <el-col :span="18">
          <p>{{ portfolioChart.crypto }}</p>
        </el-col>
        <el-col :span="6">
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
    <div>
      <line-chart :data="portfolioChart.data" :filter="portfolioChart.filter"/>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '@/components/Dashboard/Charts/LineChart'

export default {
  components: {
    LineChart
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
  mounted () {
    this.$store.dispatch('getPriceByFilter', this.portfolioChart)
  },
  methods: {
    selectLabel (label) {
      this.$store.dispatch('getPriceByFilter', { filter: label })
    }
  }
}
</script>

<style scoped>
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
