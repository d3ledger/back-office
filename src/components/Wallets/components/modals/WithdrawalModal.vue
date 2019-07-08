<template>
  <el-dialog
    :title="'Withdraw'"
    :visible.sync="withdrawFormVisible"
    width="450px"
    center
    @close="closeWithdrawDialog()"
  >
    <el-form
      ref="withdrawForm"
      :model="withdrawForm"
      class="withdraw_form"
    >
      <el-form-item
        label="I send"
        prop="amount"
      >
        <el-input
          v-numeric
          v-model="$v.withdrawForm.amount.$model"
          :class="[
            _isValid($v.withdrawForm.amount) ? 'border_success' : '',
            _isError($v.withdrawForm.amount) ? 'border_fail' : ''
          ]"
          name="amount"
          placeholder="0"
          type="number"
        >
          <div slot="append">
            {{ wallet.asset }}
          </div>
        </el-input>
        <span
          v-if="_isError($v.withdrawForm.amount)"
          class="el-form-item__error"
        >{{ _showError($v.withdrawForm.amount) }}</span>
      </el-form-item>
      <div>
        <div class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{ wallet.amount | formatPrecision }} {{ wallet.asset }}
          </span>
        </div>
        <div class="form-item-text">
          Withdrawal fee:
          <span class="form-item-text-amount">
            {{ withdrawalFeeAmount | formatPrecision }} {{ wallet.asset }}
          </span>
        </div>
      </div>
      <el-form-item
        label="Address"
        prop="wallet"
      >
        <el-select
          v-model="$v.withdrawForm.wallet.$model"
          :class="[
            'withdraw-wallet_select',
            _isValid($v.withdrawForm.wallet) ? 'border_success' : '',
            _isError($v.withdrawForm.wallet) ? 'border_fail' : ''
          ]"
          placeholder="Select withdrawal address"
        >
          <el-option
            v-for="address in whiteListAddresses"
            :key="address"
            :label="address"
            :value="address"
          />
        </el-select>
        <span
          v-if="_isError($v.withdrawForm.wallet)"
          class="el-form-item__error"
        >{{ _showError($v.withdrawForm.wallet) }}</span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="isSending"
          class="fullwidth black clickable"
          style="margin-top: 40px"
          @click="onSubmitWithdrawalForm"
        >
          Withdraw
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  _wallet,
  _amount,
  errorHandler
} from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'
import NOTIFICATIONS from '@/data/notifications'
import { FeeTypes } from '@/data/consts'

// Notary account for withdrawal.
const btcNotaryAccount = process.env.VUE_APP_BTC_NOTARY_ACCOUNT || 'btc_withdrawal_service@notary'
const ethNotaryAccount = process.env.VUE_APP_ETH_NOTARY_ACCOUNT || 'notary@notary'
const BITCOIN_ASSET_NAME = 'btc#bitcoin'

export default {
  mixins: [
    errorHandler
  ],
  validations () {
    const withdrawalWallet = { ...this.wallet, fee: this.currentWithdrawalFee }

    return {
      withdrawForm: {
        amount: {
          required,
          _amount: _amount(withdrawalWallet, this.wallet.assetId)
        },
        wallet: {
          required,
          _address: _wallet.address
        }
      }
    }
  },
  data () {
    return {
      isSending: false,

      withdrawFormVisible: false,

      withdrawForm: {
        amount: null,
        wallet: null
      }
    }
  },
  methods: {
    onOpenWithdrawalForm () {
      this.requestDataBeforeOpen()
      this.withdrawFormVisible = true
    },

    onSubmitWithdrawalForm () {
      this.$v.withdrawForm.$touch()
      if (this.$v.withdrawForm.$invalid) return

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true
          const notaryAccount = this.wallet.assetId === BITCOIN_ASSET_NAME ? btcNotaryAccount : ethNotaryAccount

          return this.transferAsset({
            privateKeys,
            assetId: this.wallet.assetId,
            to: notaryAccount,
            description: this.withdrawForm.wallet,
            amount: this.withdrawForm.amount.toString(),
            fee: this.withdrawalFeeAmount.toString(),
            feeType: FeeTypes.WITHDRAWAL
          })
            .then(() => {
              let completed = privateKeys.length === this.accountQuorum
              this.$_showMessageFromStatus(
                completed,
                NOTIFICATIONS.WITHDRAWAL_SUCCESS,
                NOTIFICATIONS.NOT_COMPLETED
              )

              this.fetchWallet()
              this.closeWithdrawDialog()
              this.withdrawFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Withdrawal error')
            })
        })
        .finally(() => { this.isSending = false })
    },

    resetWithdrawForm () {
      if (this.$refs.withdrawForm) {
        this.$v.$reset()
        this.$refs.withdrawForm.resetFields()
      }
    },

    closeWithdrawDialog () {
      this.resetWithdrawForm()
    }
  }
}
</script>

<style>

</style>
