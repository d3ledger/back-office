<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    :visible="isVisible"
    data-cy="transferModal"
    title="Transfer"
    width="450px"
    center
    @close="closeTransferForm()"
  >
    <el-form
      ref="transferForm"
      :model="transferForm"
      class="transfer_form"
    >
      <el-form-item
        label="I send"
        prop="amount"
      >
        <el-input
          v-numeric
          v-model="$v.transferForm.amount.$model"
          :class="[
            _isValid($v.transferForm.amount) ? 'border_success' : '',
            _isError($v.transferForm.amount) ? 'border_fail' : ''
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
          v-if="_isError($v.transferForm.amount)"
          class="el-form-item__error"
        >{{ _showError($v.transferForm.amount) }}</span>
      </el-form-item>
      <div>
        <div class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{ wallet.amount | formatPrecision }} {{ wallet.asset }}
          </span>
        </div>
        <div class="form-item-text">
          Transfer fee:
          <span class="form-item-text-amount">
            {{ transferFeeAmount | formatPrecision }} {{ wallet.asset }}
          </span>
        </div>
      </div>
      <el-form-item
        label="Counterparty"
        prop="to"
      >
        <el-input
          v-model="$v.transferForm.to.$model"
          :class="[
            _isValid($v.transferForm.to) ? 'border_success' : '',
            _isError($v.transferForm.to) ? 'border_fail' : ''
          ]"
          placeholder="Account id"
        />
        <span
          v-if="_isError($v.transferForm.to)"
          class="el-form-item__error"
        >{{ _showError($v.transferForm.to) }}</span>
      </el-form-item>
      <el-form-item
        label="Additional information"
        prop="description"
      >
        <el-input
          v-model="$v.transferForm.description.$model"
          :class="[
            _isValid($v.transferForm.description) ? 'border_success' : '',
            _isError($v.transferForm.description) ? 'border_fail' : ''
          ]"
          placeholder="Details"
          resize="none"
        />
        <span
          v-if="_isError($v.transferForm.description)"
          class="el-form-item__error"
        >{{ _showError($v.transferForm.description) }}</span>
      </el-form-item>
    </el-form>
    <el-button
      :loading="isSending"
      class="fullwidth black clickable"
      style="margin-top: 40px"
      @click="onSubmitTransferForm"
    >
      TRANSFER
    </el-button>
  </el-dialog>
</template>

<script>
import {
  _amount,
  _user,
  errorHandler
} from '@/components/mixins/validation'
import { required, maxLength } from 'vuelidate/lib/validators'
import { FeeTypes } from '@/data/consts'
import { mapGetters, mapActions } from 'vuex'
import numberFormat from '@/components/mixins/numberFormat'
import messageMixin from '@/components/mixins/message'

export default {
  mixins: [
    numberFormat,
    errorHandler,
    messageMixin
  ],
  validations () {
    const transferWallet = { ...this.wallet, fee: this.currentTransferFee }

    return {
      transferForm: {
        to: {
          required,
          _userDomain: _user.nameDomain,
          _userExist: _user.nameExist(
            this.servicesIPs['data-collector-service']
          ),
          _userIsMe: _user.isMe(this.accountId)
        },
        amount: {
          required,
          _amount: _amount(transferWallet, this.wallet.assetId)
        },
        description: {
          maxLength: maxLength(64)
        }
      }
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    wallet: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      isSending: false,

      transferForm: {
        to: null,
        amount: null,
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountId',
      'accountQuorum',
      'transferFee',
      'servicesIPs',
      'currentWalletPrecision'
    ]),
    currentTransferFee () {
      return this.transferFee[this.wallet.assetId]
        ? this.transferFee[this.wallet.assetId].feeFraction
        : 0
    },
    transferFeeAmount () {
      return this.$_calculateFee(
        this.transferForm.amount,
        this.currentTransferFee,
        this.currentWalletPrecision
      ).toString()
    }
  },
  methods: {
    ...mapActions([
      'transferAsset',
      'createTransferAssetTransaction',
      'openApprovalDialog',
      'openUploadTransactionDialog'
    ]),

    onSubmitTransferForm () {
      this.$v.transferForm.$touch()
      if (this.$v.transferForm.$invalid) return

      // this.openApprovalDialog()
      //   .then(privateKeys => {
      //     if (!privateKeys) return
      //     this.isSending = true
      //     return this.transferAsset({
      //       privateKeys,
      //       assetId: this.wallet.assetId,
      //       to: this.transferForm.to,
      //       description: this.transferForm.description,
      //       amount: this.transferForm.amount,
      //       fee: this.transferFeeAmount,
      //       feeType: FeeTypes.TRANSFER
      //     })
      //       .then(() => {
      //         let completed = privateKeys.length === this.accountQuorum
      //         this.$_showMessageFromStatus(
      //           completed,
      //           NOTIFICATIONS.TRANSFER_SUCCESS,
      //           NOTIFICATIONS.NOT_COMPLETED
      //         )
      //         this.$emit('update-history')
      //         this.closeTransferForm()
      //       })
      //       .catch(err => {
      //         console.error(err)
      //         this.$_showErrorAlertMessage(err.message, 'Transfer error')
      //       })
      //   })
      //   .finally(() => { this.isSending = false })
      this.createTransferAssetTransaction({
        assetId: this.wallet.assetId,
        to: this.transferForm.to,
        description: this.transferForm.description,
        amount: this.transferForm.amount,
        fee: this.transferFeeAmount,
        feeType: FeeTypes.TRANSFER
      })

      this.closeTransferForm()
      this.openUploadTransactionDialog()
    },

    resetTransferForm () {
      if (this.$refs.transferForm) {
        this.$v.$reset()
        this.$refs.transferForm.resetFields()
      }
    },

    closeTransferForm () {
      this.resetTransferForm()
      this.$emit('update:isVisible', false)
    }
  }
}
</script>

<style>

</style>
