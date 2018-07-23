<template>
  <div class="card-content shadow">
    <div class="card-content_header">
      <el-row class="card-content_header-row">
        <el-col :span="24">
          <el-input
            placeholder="Search"
            prefix-icon="el-icon-search"
            suffix-icon="el-icon-date"
            v-model="filterInput"/>
        </el-col>
      </el-row>
    </div>
    <div class="card-content_body">
      <el-row justify="center" class="table_header">
        <div class="table_header-title">Currency</div>
        <div class="table_header-title text-center">Balance</div>
        <div class="table_header-title text-right">Changes</div>
      </el-row>
      <el-row class="table_body">
        <div class="table_body-content">
          <div
            :class="['table_body-item', portfolioChart.crypto === value.asset ? 'active' : '' ]"
            v-for="(value, index) in filteredPortfolio" :key="index">
            <div class="table_body-item_content" @click="selectCrypto(value.asset)">
              <div class="column text-format">
                {{ value | formatName }}
              </div>
              <div class="column balance text-center">
                {{ value.price | formatNumberShort }}
              </div>
              <div class="column text-right">
                <span :class="[value.diff > 0 ? 'uptrend' : 'downtrend']">
                  {{ value | formatNumberPercentDiff }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash/collection'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  data () {
    return {
      filterInput: ''
    }
  },
  mixins: [
    numberFormat,
    currencySymbol
  ],
  props: {
    portfolio: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'portfolioChart'
    ]),
    filteredPortfolio () {
      return this.portfolio.filter(crypto => {
        const isName = _.includes(crypto.name.toLowerCase(), this.filterInput.toLowerCase())
        const isAsset = _.includes(crypto.asset.toLowerCase(), this.filterInput.toLowerCase())
        return isName || isAsset
      })
    }
  },
  filters: {
    formatName (crypto) {
      if (!crypto) return null
      return `${crypto.name} (${crypto.asset})`
    }
  },
  methods: {
    selectCrypto (crypto) {
      this.selectedCrypto = crypto
      this.$store.dispatch('getPriceByFilter', { crypto })
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
  transition: .3s;
  min-height: 500px;
  -webkit-transition: .3s;
}

.card-content.shadow {
  -webkit-box-shadow: -5px 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: -5px 2px 12px 0 rgba(0,0,0,.1);
}

.card-content_header {
  border-bottom: 1px solid #f5f5f5
}

.card-content_header >>> .el-input__inner {
  font-size: 20px;
  height: 4.25rem;
  border: 0;
}

.table_header {
  display: flex;
  flex-flow: row wrap;
  color: #888888;
  padding: 1rem;
}

.table_header-title {
  flex: 0 1 33%
}

.table_header-title.text-right {
  text-align: right;
}

.table_header-title.text-center {
  text-align: center;
}

.table_body {
  height: 380px;
  width: 100%;
  overflow: hidden;
}

.table_body-content {
  width: 104%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
}

.table_body-item {
  height: 80px;
  cursor: pointer;
  padding-bottom: 5px;
  border-bottom: 1px solid #f5f5f5
}

.table_body-item:hover {
  background: #f4f4f4;
}

.table_body-item.active {
  background: #f4f4f4;
  border-bottom: 1px solid #2d2d2d;
}

.table_body-item_content {
  display: flex;
  flex-flow: row wrap;
  padding: 2rem 1rem 0;
  height: 100%;
}

.table_body-item_content .column {
  flex: 0 1 33%
}

.table_body-item_content .column.text-format {
  word-break: break-all;
}

.table_body-item_content .column.text-right {
  text-align: right;
}

.table_body-item_content .column.text-center {
  text-align: center;
}

.table_body-item_content .column.balance {
  font-weight: 600;
  color: #000000;
}

.table_body-item_content .column .uptrend {
  color: #06b023;
}

.table_body-item_content .column .downtrend {
  color: #ff1339;
}

@media(max-width: 1200px) {
  .table_header {
    display: none;
  }
  .table_body-item {
    height: 100px;
  }
  .table_body-item_content .column:nth-child(1) {
    flex-grow: 1;
    flex: 0 1 80%;
  }
  .table_body-item_content .column:nth-child(2) {
    flex-grow: 1;
    flex: 0 1 20%;
    text-align: right;
  }
  .table_body-item_content .column:nth-child(3) {
    flex-grow: 1;
    flex: 0 1 100%;
  }
}
</style>
