<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <wallets-card
        title="ETH wallets"
        :wallets="eth"
        v-on:add-wallet="newWallet.type = 'ETH'; newWalletForm = true"
      />
    </el-col>
    <el-col :span="12">
      <wallets-card
        title="Waves wallets"
        :wallets="wvs"
        v-on:add-wallet="newWallet.type = 'ETH'; newWalletForm = true"
      />
    </el-col>
    <el-dialog
      title="Add a wallet"
      :visible.sync="newWalletForm"
      width="500px"
    >
      <el-form
        label-width="4rem"
      >
        <el-form-item label="Name:" prop="amount">
          <el-input name="amount" v-model="newWallet.name">
            <template slot="append">{{ newWallet.type }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Address:" prop="to">
          <el-input name="address" v-model="newWallet.address" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary">Add Wallet</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import WalletsCard from './WalletsCard'

export default {
  name: 'settings-page',
  components: {
    WalletsCard
  },
  data () {
    return {
      newWalletForm: false,
      newWallet: {
        name: null,
        address: null,
        type: null
      },
      eth: [
        {
          name: 'Work wallet',
          currency: 'ETH',
          address: 'SomeEthAddress'
        },
        {
          name: 'MyHomeWallet',
          currency: 'ETH',
          address: 'SomeOtherEthAddress'
        }
      ],
      wvs: [
        {
          name: 'Work wallet',
          currency: 'WVS',
          address: 'SomeWVSAddress'
        },
        {
          name: 'MyHomeWallet',
          currency: 'WVS',
          address: 'SomeOtherWVSAddress'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
