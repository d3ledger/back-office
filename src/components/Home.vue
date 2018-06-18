<template>
  <el-container>
    <div
      class="side-menu"
    >
      <h1 class="logo">D3</h1>
      <el-menu
        :collapse="isCollapsed"
        class="el-side-menu"
        :router="true"
        background-color="#2d2d2d"
        text-color="#a2a2a2"
        active-text-color="#fff"
        :default-active="$router.history.current.path.includes('wallets') ? '/wallets' : $router.history.current.path"
      >
        <el-menu-item index="/">
          <i class="el-icon-menu" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/wallets">
          <i class="el-icon-news" />
          <span slot="title">Wallets</span>
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
    <main style="width: 100%; height: 100vh;">
      <router-view/>
    </main>
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

<style lang="scss">
.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.side-menu {
  background-color: #2d2d2d;
  height: 100vh;
  overflow: scroll;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-side-menu > .el-menu-item.is-active{
  background: #669dd5 !important;
}

.logo {
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
}
</style>
