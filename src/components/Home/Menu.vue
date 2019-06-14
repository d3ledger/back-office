<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template class="menu">
  <div>
    <el-menu
      :router="true"
      class="el-side-menu"
      text-color="#a2a2a2"
      background-color="#1e1e1e"
      active-text-color="#000"
    >
      <h1 class="logo">
        <img
          src="@/assets/logo-small.svg"
          alt="D3"
        >
      </h1>
      <el-menu-item index="/">
        <SvgIcon
          icon-name="Chart"
          icon-class="menu-icon"
        ><ChartIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/wallets">
        <SvgIcon
          icon-name="Wallet"
          icon-class="menu-icon"
        ><WalletIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Wallets</span>
      </el-menu-item>
      <el-menu-item index="/settlements/history">
        <el-badge
          v-if="incomingSettlements.length"
          :value="incomingSettlements.length"
          :max="9"
          :class="[isMenuActive('settlements') ? 'badge active' : 'badge']"
        >
          <SvgIcon
            icon-name="Exchange"
            icon-class="menu-icon"
          ><ExchangeIcon/></SvgIcon>
        </el-badge>
        <SvgIcon
          v-else
          icon-name="Exchange"
          icon-class="menu-icon"
        ><ExchangeIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Exchange</span>
      </el-menu-item>
      <el-menu-item index="/reports">
        <SvgIcon
          icon-name="Report"
          icon-class="menu-icon"
        ><ReportIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Reports</span>
      </el-menu-item>
      <el-menu-item index="/billing-reports">
        <SvgIcon
          icon-name="Report"
          icon-class="menu-icon"
        ><ReportIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Billing</span>
      </el-menu-item>
      <el-menu-item
        v-if="quorum > 1"
        index="/transactions"
      >
        <el-badge
          v-if="allPendingTransactions.length"
          :value="allPendingTransactions.length"
          :max="9"
          :class="[isMenuActive('transactions') ? 'badge active' : 'badge']"
        >
          <SvgIcon
            icon-name="Transaction"
            icon-class="menu-icon"
          ><TransactionsIcon/></SvgIcon>
        </el-badge>
        <SvgIcon
          v-else
          icon-name="Transaction"
          icon-class="menu-icon"
        ><TransactionsIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Transactions</span>
      </el-menu-item>
      <el-menu-item
        v-if="isAdmin"
        index="/explorer"
      >
        <SvgIcon
          icon-name="Explorer"
          icon-class="menu-icon"
        ><TransactionsIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Explorer</span>
      </el-menu-item>
      <el-menu-item
        v-if="isAdmin"
        index="/fee"
      >
        <SvgIcon
          icon-name="Explorer"
          icon-class="menu-icon"
        ><TransactionsIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Fee</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <SvgIcon
          icon-name="Settings"
          icon-class="menu-icon"
        ><SettingsIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Settings</span>
      </el-menu-item>
      <el-menu-item
        class="bottom-icon"
        index="/logout"
        @click="onLogout"
      >
        <SvgIcon
          icon-name="Logout"
          icon-class="menu-icon"
        ><LogoutIcon/></SvgIcon>
        <span
          slot="title"
          class="title-left"
        >Logout</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import ChartIcon from '@/assets/menu/charts.vue'
import ExchangeIcon from '@/assets/menu/exchange'
import ReportIcon from '@/assets/menu/reports'
import SettingsIcon from '@/assets/menu/settings'
import TransactionsIcon from '@/assets/menu/transactions'
import WalletIcon from '@/assets/menu/wallet'
import LogoutIcon from '@/assets/menu/logout'
import SvgIcon from '@/components/common/SvgIcon'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Menu',
  components: {
    ChartIcon,
    ExchangeIcon,
    ReportIcon,
    SettingsIcon,
    TransactionsIcon,
    WalletIcon,
    LogoutIcon,
    SvgIcon
  },
  props: {
    quorum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isCollapsed: true
    }
  },
  computed: {
    ...mapGetters([
      'incomingSettlements',
      'allPendingTransactions',
      'accountRoles'
    ]),
    currentActiveMenu () {
      if (this.$route.path.includes('wallets')) return '/wallets'
      if (this.$route.path.includes('settlements')) return '/settlements/history'
      return this.$route.path
    },
    isAdmin () {
      return this.accountRoles.includes('admin')
    }
  },
  watch: {
    isCollapsed (value) {
      if (!value) this.getAllUnsignedTransactions()
    }
  },
  methods: {
    ...mapActions([
      'logout',
      'getAllUnsignedTransactions'
    ]),
    onLogout () {
      this.logout()
        .then(() => this.$router.push('/login'))
    },
    isMenuActive (path) {
      return this.$route.path.includes(path)
    }
  }
}
</script>

<style scoped>
.logo {
  height: 62px;
  background-color: #e43c34;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
}
.logo img {
  height: 62px;
  width: 62px;
}
.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-right: none;
  z-index: 100;
  /* Getting rid of element.ui styles */
  position: fixed !important;
  border-right: none !important;
}
.el-side-menu:not(.el-menu--collapse) {
  width: 160px;
}
.el-side-menu > .el-menu-item.is-active{
  background: white !important;
  color: black;
}
.el-menu-item.is-active .menu-icon {
  margin-right: 8px;
  text-align: center;
  color: #000000;
}
.menu-icon {
  margin-right: 8px;
  text-align: center;
  color: #ffffff;
}
.bottom-icon {
  position: absolute;
  bottom: 0;
  width: 100%
}
.title-left {
  margin-left: 1rem;
}
.badge {
  display: inline-flex;
  font-weight: bold;
}
.badge >>> .el-badge__content {
    margin-right: 0.5rem;
    background-color: #ffffff;
    border-radius: 0.2rem;
    color: #000000;
    height: 1.2rem;
    width: 1.2rem;
    line-height: 1.2rem;
    padding: 0;
    border: none;
}
.badge.active >>> .el-badge__content {
    background-color: #000000;
    color: #ffffff;
}
</style>
