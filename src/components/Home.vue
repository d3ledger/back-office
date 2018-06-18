<template>
  <el-container>
    <div
      class="side-menu"
    >
      <h1 style="color: white; display: block; text-align: center;">D3</h1>
      <el-menu
        :collapse="isCollapsed"
        class="el-side-menu"
        :router="true"
        background-color="#2d2d2d"
        text-color="#a2a2a2"
        active-text-color="#fff"
        :default-active="$router.history.current.path"
      >
        <el-menu-item index="/">
          <i class="el-icon-menu" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/wallet">
          <i class="el-icon-news" />
          <span slot="title">Wallet</span>
        </el-menu-item>
        <el-menu-item index="/settlement">
          <i class="el-icon-refresh" />
          <span slot="title">Settlement</span>
        </el-menu-item>
        <el-menu-item index="/transfer">
          <i class="el-icon-d-arrow-right" />
          <span slot="title">Transfer</span>
        </el-menu-item>
        <el-menu-item index="/report">
          <i class="el-icon-tickets" />
          <span slot="title">Report</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="el-icon-setting" />
          <span slot="title">Profile</span>
        </el-menu-item>
      </el-menu>
      <el-checkbox
        v-model="isCollapsed"
        style="margin-left: 25px"
      />
    </div>
    <el-main :class="isCollapsed ? 'main-collapsed' : 'main'">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
// TODO: Fix number of settlements
// TODO: Icons for every asset + color

import { mapState } from 'vuex'

export default {
  name: 'Home',

  data () {
    return {
      isCollapsed: false
    }
  },

  computed: {
    numberOfSettlements () {
      return this.$store.getters.waitingSettlements.length
    },

    ...mapState({
      accountId: (state) => state.Account.accountId
    })
  },

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
  },

  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background: white;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08)
}

.number-icon {
  background-color: #f56c6c;
  color: white;
  padding: .2rem .45rem;
  border-radius: 20px;
}

.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.main {
  margin-left: 200px;
  transition: margin 400ms;
}

.main-collapsed {
  margin-left: 65px;
  transition: margin 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.side-menu {
  height: 100vh;
  background-color: #2d2d2d;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-side-menu > .el-menu-item.is-active{
  background: #669dd5 !important;
}
</style>
