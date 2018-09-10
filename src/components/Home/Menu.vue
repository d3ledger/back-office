<template>
  <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
    <el-menu
      :router="true"
      :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
      text-color="#a2a2a2"
      background-color="#2D2D2D"
      active-text-color="#000"
      :default-active="currentActiveMenu"
      >
      <h1 class="logo">
        <img src="@/assets/logo-small.svg" alt="D3"/>
      </h1>
      <el-menu-item index="/">
        <SvgIcon iconName="Chart" iconClass="menu-icon"><ChartIcon/></SvgIcon>
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/wallets">
        <SvgIcon iconName="Wallet" iconClass="menu-icon"><WalletIcon/></SvgIcon>
        <span slot="title">Wallets</span>
      </el-menu-item>
      <el-menu-item index="/settlements/history">
        <SvgIcon iconName="Exchange" iconClass="menu-icon"><ExchangeIcon/></SvgIcon>
        <span slot="title">Exchange</span>
      </el-menu-item>
      <el-menu-item index="/reports">
        <SvgIcon iconName="Report" iconClass="menu-icon"><ReportIcon/></SvgIcon>
        <span slot="title">Reports</span>
      </el-menu-item>
      <el-menu-item v-if="quorum > 1" index="/transactions">
        <SvgIcon iconName="Transaction" iconClass="menu-icon"><TransactionsIcon/></SvgIcon>
        <span slot="title">Transactions</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <SvgIcon iconName="Settings" iconClass="menu-icon"><SettingsIcon/></SvgIcon>
        <span slot="title">Settings</span>
      </el-menu-item>
      <el-menu-item class="bottom-icon" index="/logout" @click="logout">
        <SvgIcon iconName="Logout" iconClass="menu-icon"><LogoutIcon/></SvgIcon>
        <span slot="title">Logout</span>
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

export default {
  name: 'Menu',
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
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    }
  },
  computed: {
    currentActiveMenu () {
      if (this.$route.path.includes('wallets')) return '/wallets'
      if (this.$route.path.includes('settlements')) return '/settlements/history'
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-right: none;
  z-index: 100;
  width: 62px;
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
</style>
