<template>
  <el-container>
    <el-menu
      :collapse="isCollapsed"
      class="el-side-menu"
      :router="true"
      background-color="#2d2d2d"
      text-color="#a2a2a2"
      active-text-color="#fff"
      :default-active="$router.history.current.path.includes('wallets') ? '/wallets' : $router.history.current.path"
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
      <div class="expand-button clickable" @click="isCollapsed = !isCollapsed">
        <i :class="isCollapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
      </div>
    </el-menu>
    <main style="width: 100%; height: 100vh;">
      <router-view/>
    </main>
  </el-container>
</template>

<script>
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
.expand-button {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #669dd5;
  font-size: 18px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.el-side-menu.el-menu--collapse {
  min-width: 62px;
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
