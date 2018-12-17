<template class="menu">
  <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
    <el-menu
      :router="true"
      :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
      text-color="#a2a2a2"
      background-color="#1e1e1e"
      active-text-color="#000"
      :default-active="currentActiveMenu"
      >
      <h1 class="logo">
        <img src="@/assets/logo-small.svg" alt="D3"/>
      </h1>
      <el-menu-item index="/">
        <SvgIcon iconName="Chart" iconClass="menu-icon"><ChartIcon/></SvgIcon>
        <span class="title-left" slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/wallets">
        <SvgIcon iconName="Wallet" iconClass="menu-icon"><WalletIcon/></SvgIcon>
        <span class="title-left" slot="title">Wallets</span>
      </el-menu-item>
      <el-menu-item index="/settlements/history">
        <el-badge
          :value="10"
          :max="9"
          :class="[isMenuActive('settlements') ? 'badge active' : 'badge']"
        >
          <SvgIcon iconName="Exchange" iconClass="menu-icon"><ExchangeIcon/></SvgIcon>
        </el-badge>
        <span class="title-left" slot="title">Exchange</span>
      </el-menu-item>
      <el-menu-item index="/reports">
        <SvgIcon iconName="Report" iconClass="menu-icon"><ReportIcon/></SvgIcon>
        <span class="title-left" slot="title">Reports</span>
      </el-menu-item>
      <el-menu-item v-if="quorum > 1" index="/transactions">
        <el-badge
          :value="10"
          :max="9"
          :class="[isMenuActive('transactions') ? 'badge active' : 'badge']"
        >
          <SvgIcon iconName="Transaction" iconClass="menu-icon"><TransactionsIcon/></SvgIcon>
        </el-badge>
        <span class="title-left" slot="title">Transactions</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <SvgIcon iconName="Settings" iconClass="menu-icon"><SettingsIcon/></SvgIcon>
        <span class="title-left" slot="title">Settings</span>
      </el-menu-item>
      <el-menu-item class="bottom-icon" index="/logout" @click="logout">
        <SvgIcon iconName="Logout" iconClass="menu-icon"><LogoutIcon/></SvgIcon>
        <span class="title-left" slot="title">Logout</span>
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
    },
    isMenuActive (path) {
      return this.$route.path.includes(path)
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
.logo {
  height: 62px;
  background-color: #e43c34;
  margin-bottom: 100px;
}
.logo img {
  height: 62px;
  width: 62px;
}
.el-menu-item {
  font-family: 'IBM Plex Sans', sans-serif;
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
.title-left {
  margin-left: 1rem;
}
.badge {
  display: inline-flex;
  font-weight: bold;
}
.badge >>> .el-badge__content {
    margin-right: 0.2rem;
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
    margin-right: 0.2rem;
    background-color: #000000;
    border-radius: 0.2rem;
    color: #ffffff;
    height: 1.2rem;
    width: 1.2rem;
    line-height: 1.2rem;
    padding: 0;
    border: none;
}
</style>
