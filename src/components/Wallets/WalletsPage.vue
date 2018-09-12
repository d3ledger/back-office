<template>
  <el-container v-if="wallets.length">
    <el-aside class="column-fullheight wallets-menu" width="280px">
      <div class="searchbar">
        <div class="searchbar__prefix">
          <fa-icon icon="search" class="searchbar__icon" />
        </div>

        <div class="searchbar__input">
          <el-input placeholder="Search" v-model="search" />
        </div>

        <div class="searchbar__sort">
          <el-dropdown trigger="click" @command="sort">
            <div class="searchbar__sort-button">
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
        :walletId="wallet.id"
        :name="wallet.name"
        :asset="wallet.asset"
      />
    </el-aside>
    <el-main class="column-fullheight wallet">
      <router-view :key="$route.params.walletId"></router-view>
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import sortBy from 'lodash/fp/sortBy'

export default {
  name: 'wallets-page',
  components: {
    WalletMenuItem: lazyComponent('Wallets/WalletMenuItem'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },

  data () {
    return {
      search: '',
      criterions: [
        { name: 'alphabetical (asc)', icon: 'sort-alpha-down', key: 'name', desc: false },
        { name: 'alphabetical (desc)', icon: 'sort-alpha-up', key: 'name', desc: true }
      ],
      currentCriterion: null
    }
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets'
    }),
    filteredWallets: function () {
      return this.search ? this.wallets.filter(x => x.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || x.asset.toLowerCase().indexOf(this.search.toLowerCase()) > -1) : this.wallets
    },
    sortedWallets: function () {
      const sorted = sortBy(this.currentCriterion.key)(this.filteredWallets)
      return this.currentCriterion.desc ? sorted.reverse() : sorted
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
    this.$store.dispatch('getAccountAssets')
    this.sort(this.criterions[0])
  },

  mounted () {
    if (this.wallets.length) {
      this.$router.push(`/wallets/${this.wallets[0].id}`)
    }
  },

  methods: {
    sort (criterion) {
      this.currentCriterion = criterion
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
  padding: 20px 15px 20px 20px;
}

.searchbar__input {
  flex: 1 1 auto;
}

.searchbar__sort {
  flex: 0 1 auto;
  padding: 20px 20px 20px 15px;
}

.searchbar__sort-button {
  display: inline-block;
  border: 1px solid #c0c4cc;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
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
