<template>
  <el-main class="column-fullheight card-wrapper flex-direction-column">
    <el-card v-if="ethWalletAddress" class="card">You have no assets at the moment. Please transfer your ETH/ERC20 tokens  to <span class="monospace bold">{{ ethWalletAddress }}</span> or wait untill someone transfers assets to your account <span class="monospace">{{ accountId }}</span>
      <qrcode-vue
        :value="ethWalletAddress"
        :size="270"
        class="qr"
      />
    </el-card>
    <br>
    <el-card v-if="btcWalletAddress" class="card">You have no assets at the moment. Please transfer your bitcoins  to <span class="monospace bold">{{ btcWalletAddress }}</span> or wait untill someone transfers assets to your account <span class="monospace">{{ accountId }}</span>
      <qrcode-vue
        :value="btcWalletAddress"
        :size="270"
        class="qr"
      />
    </el-card>
  </el-main>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { mapState, mapGetters } from 'vuex'
import { WalletTypes } from '@/data/enums'

export default {
  name: 'no-assets-card',
  components: {
    QrcodeVue
  },
  data () {
    return {
      walletTypes: WalletTypes
    }
  },

  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),
    ...mapGetters([
      'ethWalletAddress',
      'btcWalletAddress',
      'walletType'
    ])
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
.qr {
  width: 270px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>
