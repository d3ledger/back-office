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
        <el-col :span="10" class="table_header-title">Currency</el-col>
        <el-col :span="5" class="table_header-title">Balance</el-col>
        <el-col :span="9" class="table_header-title text-right">Changes</el-col>
      </el-row>
      <el-row class="table_body">
        <div class="table_body-content">
          <div :class="['table_body-item', selectedCrypto === value.asset ? 'active' : '' ]" v-for="(value, index) in filteredPortfolio" :key="index">
            <div class="table_body-item_content" @click="selectCrypto(value.asset)">
              <el-col
                :sm="24"
                :md="12"
                :lg="10">{{ value | formatName }}</el-col>
              <el-col
                :sm="24"
                :md="12"
                :lg="5"
                class="balance">
                <span >{{ value.price | formatBalance }}</span>
              </el-col>
              <el-col
                :xs="24"
                :md="24"
                :lg="9"
                class="text-right">
                <span :class="[value.diff > 0 ? 'uptrend' : 'downtrend']">
                  {{ value | formatDiff }}
                </span>
              </el-col>
            </div>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash/collection'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  data () {
    return {
      filterInput: '',
      selectedCrypto: null
    }
  },
  mixins: [
    currencySymbol
  ],
  props: {
    portfolio: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredPortfolio () {
      return this.portfolio.filter(crypto => {
        const isName = _.includes(crypto.name.toLowerCase(), this.filterInput.toLowerCase())
        const isAsset = _.includes(crypto.asset.toLowerCase(), this.filterInput.toLowerCase())
        return isName || isAsset
      })
    }
  },
  filters: {
    formatBalance (amount) {
      if (!amount) return ''
      return `${amount.toFixed(2)}`
    },
    formatName (crypto) {
      if (!crypto) return null
      return `${crypto.name} (${crypto.asset})`
    },
    formatDiff (crypto) {
      if (!crypto) return null
      return `${crypto.diff.toFixed(2)} (${crypto.percent.toFixed(2)}%)`
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
  color: #888888;
  padding: 1rem;
}

.table_header-title {}

.table_header-title.text-right {
  text-align: right;
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
  height: 60px;
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
  padding: 1.5rem 1rem 0;
  height: 100%;
}

.table_body-item_content .text-right {
  text-align: right;
}

.table_body-item_content .balance {
  font-weight: 600;
  color: #000000;
}

.table_body-item_content .uptrend {
  color: #06b023;
}

.table_body-item_content .downtrend {
  color: #ff1339;
}

@media(max-width: 1200px) {
  .table_header {
    display: none;
  }
  .table_body-item {
    font-size: inherit;
    height: 85px;
  }
  .table_body-item_content .balance {
    text-align: right
  }
}
</style>
