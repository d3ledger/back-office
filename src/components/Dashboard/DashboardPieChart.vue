<template>
  <el-card class="card">
    <div slot="header">
      Portfolio structure
    </div>
    <el-row>
      <el-col :span="10">
        <div class="list_crypto">
          <p v-for="(item, index) in portfolio"
            :key="index"
            >
            <span class="list_crypto-color"
              :style="{ backgroundColor: `#${item.color}` }"></span> {{item.asset}}
          </p>
        </div>
      </el-col>
      <el-col :span="14">
        <donat-chart :height="100" :width="100" :data="portfolio"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import DonatChart from '@/components/Dashboard/Charts/DonatChart'

export default {
  name: 'dashboard-pie-chart',
  components: {
    DonatChart
  },
  props: {
    portfolio: {
      type: Array,
      requires: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.card {
  height: 14rem;
}

.list_crypto {
  display: flex;
  flex-wrap: wrap;
}

.list_crypto p {
  width: 90px;
  margin-bottom: 1.7rem;
}

.list_crypto p:nth-child(3n) {
  margin-bottom: 0rem;
}

.list_crypto-color {
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
  border-radius: 1rem;
  display: inline-block;
  background-color: #5a85e8;
}

</style>
