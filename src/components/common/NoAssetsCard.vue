<template>
  <el-main class="column-fullheight card-wrapper">
    <el-card class="card">You have no assets at the moment. Please transfer your ETH/ERC20 tokens to <span class="monospace">{{ ethDepositAdcress }}</span> or wait untill someone transfers assets to your account <span class="monospace">{{ accountId }}</span></el-card>
  </el-main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'no-assets-card',

  data () {
    return {
      ethDepositAdcress: '0x0000000000000000000000000000000000000000'
    }
  },

  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    })
  }
}
</script>

<style scoped>
.card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  max-width: 600px;
}
</style>
