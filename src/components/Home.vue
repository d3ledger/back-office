<template>
  <el-container>
    <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
      <el-menu
        :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
        @mouseenter="isCollapsed = !isCollapsed"
        :router="true"
        text-color="#a2a2a2"
        background-color="#2D2D2D"
        active-text-color="#fff"
        :default-active="currentActiveMenu"
      >
        <h1 class="logo">D3</h1>
        <el-menu-item index="/">
          <i class="el-icon-menu" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/wallets">
          <i class="el-icon-news" />
          <span slot="title">Wallets</span>
        </el-menu-item>
        <el-menu-item index="/settlements">
          <i class="el-icon-refresh" />
          <span slot="title">Settlements</span>
        </el-menu-item>
        <el-menu-item index="/transfers">
          <i class="el-icon-d-arrow-right" />
          <span slot="title">Transfers</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <i class="el-icon-tickets" />
          <span slot="title">Reports</span>
        </el-menu-item>
        <el-menu-item index="/logout" @click="logout">
          <i class="el-icon-arrow-left" />
          <span slot="title">Logout</span>
        </el-menu-item>
        <!-- <div class="expand-button clickable">
          <i :class="isCollapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
        </div> -->
      </el-menu>
    </div>
    <el-main style="width: 100%; height: 100vh; padding: 0; padding-left: 62px;">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'

// TODO: Validate lack of selected asset
export default {
  name: 'Home',
  mixins: [
    numberFormat,
    inputValidation({
      privateKey: 'repeatingPrivateKey',
      to: 'nameDomain',
      request_amount: 'tokensAmount',
      offer_amount: 'tokensAmount'
    })
  ],
  components: {
    Menu: lazyComponent('Home/Menu')
  },
  data () {
    return {
      exchangeForm: {
        to: null,
        request_amount: '',
        offer_amount: '',
        description: null
      },
      approvalForm: {
        privateKeys: [],
        numberOfValidKeys: 0
      },
      isExchangeSending: false
    }
  },

  data () {
    return {
      approvalDialog: false,
      privateKey: null,
      isCollapsed: true
    }
  },

  computed: {
    numberOfSettlements () {
      return this.$store.getters.waitingSettlements.length
    },

    ...mapState({
      accountId: (state) => state.Account.accountId
    }),
    currentActiveMenu: function () {
      if (this.$router.history.current.path.includes('wallets')) return '/wallets'
      if (this.$router.history.current.path.includes('settlements')) return '/settlements'
      return this.$router.history.current.path
    }
  },

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
  },

  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    },
    mouseOver: function () {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style lang="scss">
.expand-button {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #669dd5;
  font-size: 18px;
  color: white;
}

.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-right: none;
  position: fixed;
  z-index: 100;
}

.el-side-menu {
  width: 62px;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 160px;
}

.el-side-menu > .el-menu-item.is-active{
  background: #1B2936 !important;
  background: #669dd5 !important;

  // border-right: 1px solid white;
}

.logo {
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
}
</style>
