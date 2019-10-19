<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container v-if="wallets.length">
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
      />
    </el-aside>
    <el-main class="column-fullheight wallet">
      <router-view :key="$route.params.walletId" />
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import sortBy from 'lodash/fp/sortBy'

export default {
  name: 'WalletsPage',
  components: {
    WalletMenuItem: lazyComponent('Wallets/WalletMenuItem'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
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
    ...mapGetters({
      wallets: 'wallets',
      portfolioPercent: 'portfolioPercent',
      currentCriterion: 'walletsSortCriterion',
      btcWalletAddress: 'btcWalletAddress',
      ethWalletAddress: 'ethWalletAddress',
      hasEthWallet: 'hasEthWallet',
      hasBtcWallet: 'hasBtcWallet'
    }),
    walletsWithFiatPrice () {
      return this.wallets.map((x, i) => {
        x.fiat = this.portfolioPercent[i] ? this.portfolioPercent[i].price : 1
        return x
      })
    },
    filteredWallets () {
      const walletsWithEmpty = [...this.walletsWithFiatPrice]
      if (this.btcWalletAddress && !this.hasBtcWallet) {
        walletsWithEmpty.push({
          id: 'btc-empty',
          name: 'Bitcoin',
          asset: 'BTC'
        })
      }
      if (this.ethWalletAddress && !this.hasEthWallet) {
        walletsWithEmpty.push({
          id: 'eth-empty',
          name: 'Ether',
          asset: 'ETH'
        })
      }

      return this.search
        ? walletsWithEmpty.filter(x => x.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || x.asset.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
        : walletsWithEmpty
    },
    sortedWallets () {
      const { numeric, key, desc } = this.currentCriterion
      const sorted = sortBy(x => numeric ? parseFloat(x[key]) : x[key])(this.filteredWallets)
      return desc ? sorted.reverse() : sorted
    }
  },

  watch: {
    '$route' (to, from) {
      if (to.name === 'wallets' && this.wallets.length) {
        this.$router.push(`/wallets/${this.wallets[0].id}`)
      }
    }
  },

  created () {
    this.loadWalletsSortCriterion()
    this.getAccountAssets()
    this.getAllAssetsTransactions()

    if (!this.currentCriterion) this.sort(this.criterions[0])
  },

  mounted () {
    if (this.wallets.length) {
      this.$router.push(`/wallets/${this.sortedWallets[0].id}`)
    }
  },

  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAllAssetsTransactions',
      'loadWalletsSortCriterion',
      'updateWalletsSortCriterion'
    ]),
    sort (criterion) {
      this.updateWalletsSortCriterion(criterion)
    }
  }
}
</script>

<style scoped>
.wallets-menu {
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
}

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
