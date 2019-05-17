<template>
  <el-dialog
    :visible="exchangeDialogVisible"
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
            placeholder="asset"
            style="width: 100px"
            @change="getOfferToRequestPrice()"
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
      <span class="form-item-text">
        Available balance:
        <span
          v-if="exchangeDialogOfferAsset"
          class="form-item-text-amount"
        >
          {{ wallets.find(x => x.asset === exchangeDialogOfferAsset).amount | formatPrecision }} {{ exchangeDialogOfferAsset }}
        </span>
        <span v-else>...</span>
      </span>
      <el-form-item
        label="I receive"
        prop="request_amount"
      >
        <el-input
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
            placeholder="asset"
            style="width: 100px"
            @change="getOfferToRequestPrice()"
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
      <span class="form-item-text">
        Market price:
        <span
          v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset && exchangeDialogPrice"
          class="form-item-text-amount"
        >
          1 {{ exchangeDialogOfferAsset }} ≈ {{ exchangeDialogPrice }} {{ exchangeDialogRequestAsset }}
        </span>
        <span v-else>...</span>
      </span>
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
import NOTIFICATIONS from '@/data/notifications'

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
    const offerAmount = { amount: Number.MAX_SAFE_INTEGER, precision }
    return {
      exchangeForm: {
        to: {
          required,
          _userDomain: _user.nameDomain,
          _userExist: _user.nameExist
        },
        request_amount: {
          required,
          _asset: _wallet.asset(this.exchangeDialogRequestAsset),
          _amount: _amount(offerAmount)
        },
        offer_amount: {
          required,
          _asset: _wallet.asset(this.exchangeDialogOfferAsset),
          _amount: _amount({ amount, precision })
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
      'accountQuorum',
      'availableAssets'
    ]),

    assetsWithoutOffer () {
      return this.availableAssets
        .filter(a => a.asset !== this.exchangeDialogOfferAsset)
    },

    assetsWithoutRequest () {
      return this.wallets.filter(a => a.asset !== this.exchangeDialogRequestAsset)
    },

    exchangeDialogOfferAsset: {
      get () {
        return this.$store.getters.exchangeDialogOfferAsset
      },
      set (asset) {
        this.$store.commit('SET_EXCHANGE_DIALOG_OFFER_ASSET', asset)
      }
    },

    exchangeDialogRequestAsset: {
      get () {
        return this.$store.getters.exchangeDialogRequestAsset
      },
      set (asset) {
        this.$store.commit('SET_EXCHANGE_DIALOG_REQUEST_ASSET', asset)
      }
    },

    numberOfSettlements () {
      return this.$store.getters.incomingSettlements.length
    }
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'closeExchangeDialog',
      'getOfferToRequestPrice',
      'createSettlement'
    ]),

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

      const s = this.exchangeForm
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isExchangeSending = true
          const offerAsset = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset).assetId
          const requestAsset = this.wallets.find(x => x.asset === this.exchangeDialogRequestAsset).assetId
          return this.createSettlement({
            privateKeys,
            to: s.to,
            offerAssetId: offerAsset,
            offerAmount: s.offer_amount,
            requestAssetId: requestAsset,
            requestAmount: s.request_amount,
            description: s.description
          })
            .then(() => {
              let completed = privateKeys.length === this.accountQuorum
              this.$_showMessageFromStatus(
                completed,
                NOTIFICATIONS.SETTLEMENT_SUCCESS,
                NOTIFICATIONS.NOT_COMPLETED
              )

              this.closeExchangeDialogWith()
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Exchange error')
            })
            .finally(() => {
              this.isExchangeSending = false
            })
        })
    }
  }
}
</script>

<style scope>
</style>
