<template>
  <el-dialog
    :visible.sync="receiveFormVisible"
    title="Deposit"
    width="450px"
    center
  >
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="text-align: center; margin-bottom: 20px">
        <p>Scan QR code or send your {{ wallet.asset }} to</p>
        <p><span
          data-cy="deposit-address"
          class="monospace"
        >{{ walletAddress }}</span></p>
      </div>
      <qrcode-vue
        :value="walletAddress"
        :size="270"
      />
    </div>
  </el-dialog>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  data () {
    return {
      receiveFormVisible: false
    }
  }
}
</script>

<style>

</style>
