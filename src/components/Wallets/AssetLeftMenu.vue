<template>
  <el-aside
    class="column-fullheight wallets-menu"
    width="250px"
  >
    <div class="searchbar">
      <div class="searchbar__prefix">
        <fa-icon
          icon="search"
          class="searchbar__icon"
        />
      </div>

      <div class="searchbar__input">
        <el-input
          v-model="search"
          placeholder="Search"
        />
      </div>

      <div class="searchbar__sort">
        <el-dropdown
          trigger="click"
          @command="sort"
        >
          <div
            id="wallets-sort-button"
            class="searchbar__sort-button"
          >
            <fa-icon
              :icon="currentCriterion.icon"
              class="searchbar__icon"
            />
          </div>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="criterion in criterions"
              :key="criterion.name"
              :command="criterion"
              :disabled="currentCriterion.name === criterion.name"
            >
              <fa-icon :icon="criterion.icon" />
              {{ criterion.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <wallet-menu-item
      v-for="wallet in sortedWallets"
      :key="wallet.id"
      :wallet-id="wallet.id"
      :name="wallet.name"
      :asset="wallet.asset"
      :active="activeWallet"
      @select-asset="selectAsset"
    />
  </el-aside>
</template>

<script>
import { lazyComponent } from '@router'
import sortBy from 'lodash/fp/sortBy'

export default {
  name: 'AssetLeftMenu',
  components: {
    WalletMenuItem: lazyComponent('Wallets/WalletMenuItem')
  },
  props: {
    wallets: {
      type: Array,
      default: () => []
    },
    activeWallet: {
      type: Object,
      default: () => {}
    },
    currentCriterion: {
      type: Object,
      default: () => {}
    },
    portfolioPercent: {
      type: Array,
      default: () => []
    },
    btcWalletAddress: {
      type: String,
      default: ''
    },
    ethWalletAddress: {
      type: String,
      default: ''
    },
    hasEthWallet: {
      type: Boolean,
      default: false
    },
    hasBtcWallet: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: '',
      criterions: [
        { name: 'alphabetical (asc)', icon: 'sort-alpha-up', key: 'name', desc: false },
        { name: 'alphabetical (desc)', icon: 'sort-alpha-down', key: 'name', desc: true },
        { name: 'token amount (asc)', icon: 'sort-amount-up', key: 'amount', desc: false, numeric: true },
        { name: 'token amount (desc)', icon: 'sort-amount-down', key: 'amount', desc: true, numeric: true },
        { name: 'fiat price (asc)', icon: 'sort-numeric-up', key: 'fiat', desc: false, numeric: true },
        { name: 'fiat price (desc)', icon: 'sort-numeric-down', key: 'fiat', desc: true, numeric: true }
      ]
    }
  },
  computed: {
    walletsWithFiatPrice () {
      return this.wallets.map((x, i) => {
        x.fiat = this.portfolioPercent[i] ? this.portfolioPercent[i].price : 1
        return x
      })
    },
    filteredWallets () {
      const walletsWithEmpty = [...this.walletsWithFiatPrice]
      const ETH = {
        id: 'eth-empty',
        name: 'Ether',
        asset: 'ETH'
      }
      const BTC = {
        id: 'btc-empty',
        name: 'Bitcoin',
        asset: 'BTC'
      }

      if (this.btcWalletAddress && !this.hasBtcWallet) {
        walletsWithEmpty.push(BTC)
      }
      if (this.ethWalletAddress && !this.hasEthWallet) {
        walletsWithEmpty.push(ETH)
      }

      return this.search
        ? walletsWithEmpty.filter(
          x => x.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          x.asset.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        )
        : walletsWithEmpty
    },
    sortedWallets () {
      const { numeric, key, desc } = this.currentCriterion
      const sorted = sortBy(x => numeric ? parseFloat(x[key]) : x[key])(this.filteredWallets)
      return desc ? sorted.reverse() : sorted
    }
  },
  created () {
    if (!this.currentCriterion) this.sort(this.criterions[0])
  },
  methods: {
    sort (criterion) {
      this.$emit('sort-menu', criterion)
    },
    selectAsset (asset) {
      this.$emit('select-asset', asset)
    }
  }
}
</script>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
}

.searchbar__prefix {
  flex: 0 1 auto;
  padding: 20px 15px 15px 20px;
}

.searchbar__input {
  flex: 1 1 auto;
}

.searchbar__sort {
  flex: 0 1 auto;
  padding: 20px 20px 15px 15px;
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
</style>
