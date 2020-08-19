<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    :visible="exchangeDialogVisible"
    data-cy="exchangeModal"
    title="Exchange"
    width="450px"
    top="2vh"
    center
    @close="closeExchangeDialogWith()"
  >
    <el-form
      ref="exchangeForm"
      :model="exchangeForm"
      class="exchange_form"
    >
      <el-form-item
        label="I send"
        prop="offer_amount"
      >
        <el-input
          v-numeric
          v-model="$v.exchangeForm.offer_amount.$model"
          :class="[
            _isValid($v.exchangeForm.offer_amount) ? 'border_success' : '',
            _isError($v.exchangeForm.offer_amount) ? 'border_fail' : ''
          ]"
          name="amount"
          type="number"
          placeholder="0"
        >
          <el-select
            slot="append"
            v-model="exchangeDialogOfferAsset"
            placeholder="Asset"
            style="width: 100px"
            @change="onOfferAssetChange"
          >
            <el-option
              v-for="wallet in assetsWithoutRequest"
              :key="wallet.id"
              :label="wallet.asset"
              :value="wallet.asset"
            >
              <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
            </el-option>
          </el-select>
        </el-input>
        <span
          v-if="_isError($v.exchangeForm.offer_amount)"
          class="el-form-item__error"
        >{{ _showError($v.exchangeForm.offer_amount) }}</span>
      </el-form-item>
      <div>
        <div class="form-item-text">
          Available balance:
          <span
            v-if="exchangeDialogOfferAsset"
            class="form-item-text-amount"
          >
            {{ wallets.find(x => x.asset === exchangeDialogOfferAsset).amount | formatPrecision }} {{ exchangeDialogOfferAsset }}
          </span>
          <span v-else>...</span>
        </div>
        <div class="form-item-text">
          Offer fee:
          <span
            v-if="exchangeDialogOfferAsset"
            class="form-item-text-amount"
          >
            {{ offerFeeAmount | formatPrecision }} {{ exchangeDialogOfferAsset }}
          </span>
          <span v-else>...</span>
        </div>
      </div>
      <el-form-item
        label="I receive"
        prop="request_amount"
      >
        <el-input
          v-numeric
          v-model="$v.exchangeForm.request_amount.$model"
          :class="[
            _isValid($v.exchangeForm.request_amount) ? 'border_success' : '',
            _isError($v.exchangeForm.request_amount) ? 'border_fail' : ''
          ]"
          name="amount"
          type="number"
          placeholder="0"
        >
          <el-select
            slot="append"
            v-model="exchangeDialogRequestAsset"
            placeholder="Asset"
            style="width: 100px"
            class="select_asset"
            @change="onRequestAssetChange"
          >
            <el-option
              v-for="wallet in assetsWithoutOffer"
              :key="wallet.id"
              :label="wallet.asset"
              :value="wallet.asset"
            >
              <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
            </el-option>
          </el-select>
        </el-input>
        <span
          v-if="_isError($v.exchangeForm.request_amount)"
          class="el-form-item__error"
        >{{ _showError($v.exchangeForm.request_amount) }}</span>
      </el-form-item>
      <div>
        <div class="form-item-text">
          Market price:
          <span
            v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset && exchangeDialogPrice"
            class="form-item-text-amount"
          >
            {{ $v.exchangeForm.offer_amount.$model }} {{ exchangeDialogOfferAsset }} ≈ {{ marketPrice }} {{ exchangeDialogRequestAsset }}
          </span>
          <span v-else>...</span>
        </div>
        <div class="form-item-text">
          Request fee:
          <span
            v-if="exchangeDialogOfferAsset"
            class="form-item-text-amount"
          >
            {{ requestFeeAmount | formatPrecision }} {{ exchangeDialogRequestAsset }}
          </span>
          <span v-else>...</span>
        </div>
      </div>

      <el-form-item
        label="Counterparty"
        prop="to"
      >
        <el-input
          v-model="$v.exchangeForm.to.$model"
          :class="[
            _isValid($v.exchangeForm.to) ? 'border_success' : '',
            _isError($v.exchangeForm.to) ? 'border_fail' : ''
          ]"
          placeholder="Account id"
        />
        <span
          v-if="_isError($v.exchangeForm.to)"
          class="el-form-item__error"
        >{{ _showError($v.exchangeForm.to) }}</span>
      </el-form-item>
      <el-form-item
        label="Additional information"
        prop="description"
      >
        <el-input
          v-model="$v.exchangeForm.description.$model"
          :class="[
            _isValid($v.exchangeForm.description) ? 'border_success' : '',
            _isError($v.exchangeForm.description) ? 'border_fail' : ''
          ]"
          placeholder="Description"
          resize="none"
        />
        <span
          v-if="_isError($v.exchangeForm.description)"
          class="el-form-item__error"
        >{{ _showError($v.exchangeForm.description) }}</span>
      </el-form-item>
    </el-form>
    <el-button
      :loading="isExchangeSending"
      class="dialog-form_buttons fullwidth action"
      style="margin-top: 40px"
      @click="onSubmitExchangeDialog()"
    >
      EXCHANGE
    </el-button>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import numberFormat from '@/components/mixins/numberFormat'
import messageMixin from '@/components/mixins/message'
import { FeeTypes, BillingTypes } from '@/data/consts'
// import NOTIFICATIONS from '@/data/notifications'

import {
  _user,
  _amount,
  _wallet,
  errorHandler
} from '@/components/mixins/validation'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'ExchangeModal',
  mixins: [
    messageMixin,
    numberFormat,
    errorHandler
  ],
  validations () {
    const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
    const { amount, precision } = wallet || { amount: 0, precision: 0 }
    const offerAmount = { amount: amount, fee: this.currentOfferFee, precision }
    const requestAmount = { amount: Number.MAX_SAFE_INTEGER, precision }
    return {
      exchangeForm: {
        to: {
          required,
          _userDomain: _user.nameDomain,
          _userExist: _user.nameExist(
            this.servicesIPs['data-collector-service']
          ),
          _userIsMe: _user.isMe(this.accountId)
        },
        offer_amount: {
          required,
          _asset: _wallet.asset(this.exchangeDialogOfferAsset),
          _amount: _amount(offerAmount)
        },
        request_amount: {
          required,
          _asset: _wallet.asset(this.exchangeDialogRequestAsset),
          _amount: _amount(requestAmount)
        },
        description: {
          maxLength: maxLength(64)
        }
      }
    }
  },
  data () {
    return {
      exchangeForm: {
        to: null,
        request_amount: '',
        offer_amount: '',
        description: null
      },
      isExchangeSending: false
    }
  },

  computed: {
    ...mapGetters([
      'wallets',
      'exchangeDialogVisible',
      'exchangeDialogPrice',
      'exchangeDialogOfferAssetPrecision',
      'exchangeDialogRequestAssetPrecision',
      'accountQuorum',
      'availableAssets',
      'exchangeFee',
      'servicesIPs',
      'accountId'
    ]),

    assetsWithoutOffer () {
      return this.availableAssets
        .filter(a => a.asset !== this.exchangeDialogOfferAsset)
    },

    assetsWithoutRequest () {
      return this.wallets
        .filter(a => a.asset !== this.exchangeDialogRequestAsset)
    },

    exchangeDialogOfferAsset: {
      get () {
        return this.$store.getters.exchangeDialogOfferAsset
      },
      set (asset) {
        this.getExchangeAssetInfo({ asset, type: 'OFFER' })
      }
    },

    exchangeDialogRequestAsset: {
      get () {
        return this.$store.getters.exchangeDialogRequestAsset
      },
      set (asset) {
        this.getExchangeAssetInfo({ asset, type: 'REQUEST' })
      }
    },

    numberOfSettlements () {
      return this.$store.getters.incomingSettlements.length
    },

    currentOfferFee () {
      const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
      return wallet && this.exchangeFee[wallet.assetId] ? this.exchangeFee[wallet.assetId].feeFraction : 0
    },

    currentRequestFee () {
      const wallet = this.availableAssets.find(x => x.asset === this.exchangeDialogRequestAsset)
      return wallet && this.exchangeFee[wallet.assetId] ? this.exchangeFee[wallet.assetId].feeFraction : 0
    },

    offerFeeAmount () {
      if (
        this.exchangeFee[this.offerAsset] &&
        this.exchangeFee[this.offerAsset].feeType === 'FRACTION'
      ) {
        return this.$_multiply(
          this.exchangeForm.offer_amount,
          this.currentOfferFee,
          this.exchangeDialogOfferAssetPrecision
        ).toString()
      }
      return this.currentOfferFee
    },

    requestFeeAmount () {
      if (
        this.exchangeFee[this.requestAsset] &&
        this.exchangeFee[this.requestAsset].feeType === 'FRACTION'
      ) {
        return this.$_multiply(
          this.exchangeForm.request_amount,
          this.currentRequestFee,
          this.exchangeDialogRequestAssetPrecision
        ).toString()
      }
      return this.currentRequestFee
    },

    offerAsset () {
      const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
      return wallet ? wallet.assetId : null
    },

    requestAsset () {
      const wallet = this.availableAssets.find(x => x.asset === this.exchangeDialogRequestAsset)
      return wallet ? wallet.assetId : null
    },

    marketPrice () {
      return this.$_multiply(
        this.exchangeForm.offer_amount,
        this.exchangeDialogPrice,
        this.exchangeDialogOfferAssetPrecision
      ).toString()
    }
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'closeExchangeDialog',
      'createSettlement',
      'getExchangeAssetInfo',
      'createSettlementTransaction',
      'openUploadTransactionDialog',
      'getBillingData'
    ]),

    onOfferAssetChange (assetName) {
      const asset = this.wallets.find(x => x.asset === assetName).assetId
      const [, domain] = this.accountId.split('@')
      this.getBillingData({ asset, domain, billingType: BillingTypes.EXCHANGE })
    },

    onRequestAssetChange (assetName) {
      const asset = this.availableAssets.find(x => x.asset === assetName).assetId
      const [, domain] = this.accountId.split('@')
      this.getBillingData({ asset, domain, billingType: BillingTypes.EXCHANGE })
    },

    closeExchangeDialogWith () {
      this.closeExchangeDialog()
      this.$v.$reset()
      this.$refs.exchangeForm.resetFields()
      this.exchangeForm.description = ''
      this.exchangeDialogOfferAsset = ''
      this.exchangeDialogRequestAsset = ''
    },

    onSubmitExchangeDialog () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      // const s = this.exchangeForm
      // this.openApprovalDialog()
      //   .then(privateKeys => {
      //     if (!privateKeys) return
      //     this.isExchangeSending = true
      //     const offerAsset = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset).assetId
      //     const requestAsset = this.availableAssets.find(x => x.asset === this.exchangeDialogRequestAsset).assetId
      //     return this.createSettlement({
      //       privateKeys,
      //       to: s.to,
      //       offerAssetId: offerAsset.toLowerCase(),
      //       offerAmount: s.offer_amount,
      //       requestAssetId: requestAsset.toLowerCase(),
      //       requestAmount: s.request_amount,
      //       description: s.description
      //     })
      //       .then(() => {
      //         let completed = privateKeys.length === this.accountQuorum
      //         this.$_showMessageFromStatus(
      //           completed,
      //           NOTIFICATIONS.SETTLEMENT_SUCCESS,
      //           NOTIFICATIONS.NOT_COMPLETED
      //         )
      //         this.closeExchangeDialogWith()
      //       })
      //       .catch(err => {
      //         console.error(err)
      //         this.$_showErrorAlertMessage(err.message, 'Exchange error')
      //       })
      //       .finally(() => {
      //         this.isExchangeSending = false
      //       })
      //   })
      const s = this.exchangeForm

      this.createSettlementTransaction({
        to: s.to,
        offerAssetId: this.offerAsset.toLowerCase(),
        offerAmount: s.offer_amount,
        requestAssetId: this.requestAsset.toLowerCase(),
        requestAmount: s.request_amount,
        description: s.description,
        feeType: FeeTypes.EXCHANGE,
        senderFee: this.offerFeeAmount,
        recieverFee: this.requestFeeAmount
      }).then(() => {
        this.closeExchangeDialogWith()
        this.openUploadTransactionDialog()
      })
    }
  }
}
</script>

<style scope>
.exchange_form .select_asset {
  padding-top: 0
}
</style>
