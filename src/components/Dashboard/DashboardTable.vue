<template>
  <div class="card-content shadow">
    <div class="card-content_header">
      <el-row class="card-content_header-row">
        <el-col :span="24">
          <!-- <el-input
            placeholder="Search"
            prefix-icon="el-icon-search"
            v-model="filterInput"/> -->
          <div class="searchbar">
            <div class="searchbar__prefix">
              <fa-icon icon="search" class="searchbar__icon" />
            </div>

            <div class="searchbar__input">
              <el-input placeholder="Search" v-model="filterInput" />
            </div>

            <div class="searchbar__sort">
              <el-dropdown trigger="click" @command="sort">
                <div id="wallets-sort-button" class="searchbar__sort-button">
                  <fa-icon
                    :icon="dashboardSortCriterion.icon"
                    class="searchbar__icon"
                  />
                </div>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="criterion in criterions"
                    :key="criterion.name"
                    :command="criterion"
                    :disabled="dashboardSortCriterion.name === criterion.name"
                  >
                    <fa-icon :icon="criterion.icon" />
                    {{ criterion.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="card-content_body">
      <el-row justify="center" class="table_header">
        <div class="table_header-title currency">Currency</div>
        <div class="table_header-title text-left balance">Balance</div>
        <div class="table_header-title text-right changes">Changes</div>
      </el-row>
      <el-row class="table_body">
        <div class="table_body-content" :style="{ height: `${dashboardChartHeight}px` }">
          <div
            :class="['table_body-item', portfolioChart.crypto === value.asset ? 'active' : '' ]"
            v-for="(value, index) in sortedPortfolio" :key="index">
            <div class="table_body-item_content" @click="selectCrypto(value.asset)">
              <div class="column text-format currency">
                {{ value | formatName }}
              </div>
              <div class="column balance text-center balance">
                {{ value.price | formatNumberShort }} {{ currencySymbol }}
              </div>
              <div class="column text-right changes">
                <span :class="classTrend(value.diff)">
                  {{ value.diff | formatNumberShort }} {{ currencySymbol }} ({{value.percent | formatPercent }})
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
import includes from 'lodash/includes'
import sortBy from 'lodash/fp/sortBy'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  data () {
    return {
      filterInput: '',
      criterions: [
        { name: 'alphabetical (asc)', icon: 'sort-alpha-down', key: 'name', desc: false },
        { name: 'alphabetical (desc)', icon: 'sort-alpha-up', key: 'name', desc: true },
        { name: 'balance amount (asc)', icon: 'sort-amount-down', key: 'price', desc: false, numeric: true },
        { name: 'balance amount (desc)', icon: 'sort-amount-up', key: 'price', desc: true, numeric: true },
        { name: 'price change (asc)', icon: 'sort-numeric-down', key: 'diff', desc: false, numeric: true },
        { name: 'price change (desc)', icon: 'sort-numeric-up', key: 'diff', desc: true, numeric: true },
        { name: 'percent change (asc)', icon: 'sort-numeric-down', key: 'percent', desc: false, numeric: true },
        { name: 'percent change (desc)', icon: 'sort-numeric-up', key: 'percent', desc: true, numeric: true }
      ]
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
    },
    dashboardChartHeight: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'portfolioChart',
      'dashboardSortCriterion'
    ]),
    filteredPortfolio () {
      return this.portfolio.filter(crypto => {
        const isName = includes(crypto.name.toLowerCase(), this.filterInput.toLowerCase())
        const isAsset = includes(crypto.asset.toLowerCase(), this.filterInput.toLowerCase())
        return isName || isAsset
      })
    },
    sortedPortfolio () {
      const { numeric, key, desc } = this.dashboardSortCriterion
      const sorted = sortBy(x => {
        console.log(x)
        return numeric ? parseFloat(x[key]) : x[key]
      })(this.filteredPortfolio)
      console.log(sorted)
      return desc ? sorted.reverse() : sorted
    }
  },
  filters: {
    formatName (crypto) {
      if (!crypto) return null
      return `${crypto.name} (${crypto.asset})`
    }
  },
  mounted () {
    this.$store.dispatch('loadDashboardSortCriterion')

    if (!this.dashboardSortCriterion) this.sort(this.criterions[0])
  },
  methods: {
    selectCrypto (crypto) {
      this.selectedCrypto = crypto
      this.$store.dispatch('getPriceByFilter', { crypto })
    },
    classTrend (value) {
      let className = 'neutraltrend'
      if (value > 0) className = 'uptrend'
      if (value < 0) className = 'downtrend'
      return className
    },
    sort (criterion) {
      this.$store.dispatch('updateDashboardSortCriterion', criterion)
    }
  }
}
</script>

<style scoped>
.card-content_header {
  border-bottom: 1px solid #f5f5f5
}

.searchbar {
  display: flex;
  align-items: center;
}

.searchbar__prefix {
  flex: 0 1 auto;
  padding: 15px 15px 15px 20px;
}

.searchbar__input {
  flex: 1 1 auto;
}

.searchbar__sort {
  flex: 0 1 auto;
  padding: 13px 20px 13px 15px;
}

.searchbar__sort-button {
  display: inline-block;
  border: 1px solid #c0c4cc;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.searchbar__icon {
  color: #c0c4cc;
}

.searchbar .el-input {
  height: 100%;
}

.searchbar .el-input >>> input {
  height: 100%;
  border: none;
  padding: 0;
}

.table_header {
  display: flex;
  flex-flow: row wrap;
  color: #888888;
  padding: 0.7rem 1rem;
  justify-content: space-between
}

.table_header-title.currency {
  flex: 0 1 47%;
}

.table_header-title.balance,
.table_header-title.changes {
  flex: auto;
}

.table_header-title.text-right {
  text-align: right;
}

.table_header-title.text-left {
  text-align: left;
}

.table_body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.table_body-content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
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
  border-bottom: 2px solid #2d2d2d;
}

.table_body-item_content {
  display: flex;
  flex-flow: row wrap;
  padding: 2rem 1rem 0;
  height: 100%;
  font-size: 0.9rem;
}

.table_body-item_content .column.currency {
  flex: 0 1 40%;
}

.table_body-item_content .column.balance,
.table_body-item_content .column.changes {
  flex: auto;
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

.table_body-item_content .column .neutraltrend {
  color: #888888;
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
