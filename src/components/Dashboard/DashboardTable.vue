<template>
  <el-card>
    <div class="card_header" slot="header">
      <el-input
        placeholder="Search"
        prefix-icon="el-icon-search"
        suffix-icon="el-icon-date"
        v-model="filterInput"/>
    </div>
    <div>
      <el-row justify="center" class="table_header">
        <el-col :span="8" class="table_header-title">Currency</el-col>
        <el-col :span="8" class="table_header-title">Balance</el-col>
        <el-col :span="8" class="table_header-title">Changes</el-col>
      </el-row>
      <el-row class="table_body">
        <div class="table_body-item" v-for="(value, index) in filteredPortfolio" :key="index">
          <div class="table_body-content" @click="selectCrypto(value.asset)">
            <el-col :span="8">{{ value | formatName }}</el-col>
            <el-col :span="8">
              <span class="balance">{{ value.price | formatBalance }}</span>
            </el-col>
            <el-col :span="8">
              <!-- TODO: Finish this trend -->
              <!-- <span :class="[Math.round(Math.random()) ? 'uptrend' : 'downtrend']">
                {{ value.changes || '4 000 ₽ (54 %)' }}
              </span> -->
            </el-col>
          </div>
        </div>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import _ from 'lodash/collection'

export default {
  data () {
    return {
      filterInput: ''
    }
  },
  props: {
    portfolio: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredPortfolio () {
      return this.portfolio.filter(animal => {
        return _.includes(animal.name.toLowerCase(), this.filterInput.toLowerCase())
      })
    }
  },
  filters: {
    formatBalance (amount) {
      if (!amount) return ''
      return `${amount.toFixed(2)} ₽`
    },
    formatName (crypto) {
      if (!crypto) return null
      return `${crypto.name} (${crypto.asset})`
    }
  },
  methods: {
    selectCrypto (crypto) {
      this.$store.dispatch('getPriceByFilter', { crypto })
    }
  }
}
</script>

<style scoped>
.content {
  background-color: #f5f5f5;
}

.card_header input[type=text] {
  border: 0;
  height: 50px;
}

.table_header {
  color: #888888;
}

.table_header-title {
  text-align: center;
}

.table_body {}

.table_body ul {
  list-style-type: none;
}

.table_body-item {
  height: 50px;
  cursor: pointer;
  text-align: center;
}

.table_body-item:hover {
  background: #f4f4f4;
}

.table_body-item.active {
  background: #f4f4f4;
  border-bottom: 1px solid #2d2d2d;
}

.table_body-content {
  padding: 1rem;
}

.table_body-item .balance {
  font-weight: 600;
  color: #000000;
}

.table_body-item .uptrend {
  color: #ff1339;
}

.table_body-item .downtrend {
  color: #06b023;
}
</style>
