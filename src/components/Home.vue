<template>
  <el-container>
    <el-header class="header">
      <el-menu
        :default-active="$router.history.current.path.includes('settlements') ? '/settlements' : $router.history.current.path"
        :router="true"
        mode="horizontal"
        style="width: 100%"
      >
        <el-menu-item index="/">Wallets</el-menu-item>
        <el-menu-item index="/settlements">Settlements <span class="number-icon">2</span></el-menu-item>
        <el-submenu index="user" style="float: right">
          <template slot="title">{{ accountId }}</template>
          <el-menu-item index="/settings">Settings</el-menu-item>
          <el-menu-item index="logout" @click="logout">Logout</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main>
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

  computed: {
    ...mapState({
      accountId: (state) => state.Account.accountId
    })
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
</style>
