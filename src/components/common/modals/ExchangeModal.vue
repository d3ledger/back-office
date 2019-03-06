<template>
  <el-dialog
    title="Exchange"
    width="450px"
    top="2vh"
    :visible="exchangeDialogVisible"
    @close="closeExchangeDialogWith()"
    center
  >
    <el-form
      ref="exchangeForm"
      :model="exchangeForm"
      class="exchange_form"
    >
      <el-form-item label="I send" prop="offer_amount" >
        <el-input
          name="amount"
          v-model="$v.exchangeForm.offer_amount.$model"
          placeholder="0"
          :class="[
            _isValid($v.exchangeForm.offer_amount) ? 'border_success' : '',
            _isError($v.exchangeForm.offer_amount) ? 'border_fail' : ''
          ]"
        >
          <el-select
            v-model="exchangeDialogOfferAsset"
            @change="getOfferToRequestPrice()"
            slot="append"
            placeholder="asset"
            style="width: 100px"
          >
            <el-option
              v-for="wallet in assetsWithoutRequest"
              :key="wallet.id"
              :label="wallet.asset"
              :value="wallet.asset">
                <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
            </el-option>
          </el-select>
        </el-input>
        <span
          v-if="_isError($v.exchangeForm.offer_amount)"
          class="el-form-item__error"
        >Please provide correct private key</span>
      </el-form-item>
      <span class="form-item-text">
        Available balance:
        <span v-if="exchangeDialogOfferAsset" class="form-item-text-amount">
          {{ wallets.find(x => x.asset === exchangeDialogOfferAsset).amount | formatPrecision }} {{ exchangeDialogOfferAsset }}
        </span>
        <span v-else>...</span>
      </span>
      <el-form-item label="I receive" prop="request_amount">
        <el-input
          name="amount"
          v-model="$v.exchangeForm.request_amount.$model"
          placeholder="0"
          :class="[
            _isValid($v.exchangeForm.request_amount) ? 'border_success' : '',
            _isError($v.exchangeForm.request_amount) ? 'border_fail' : ''
          ]"
        >
          <el-select
            v-model="exchangeDialogRequestAsset"
            @change="getOfferToRequestPrice()"
            slot="append"
            placeholder="asset"
            style="width: 100px"
          >
            <el-option
              v-for="wallet in assetsWithoutOffer"
              :key="wallet.id"
              :label="wallet.asset"
              :value="wallet.asset">
                <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
            </el-option>
          </el-select>
        </el-input>
        <span
          v-if="_isError($v.exchangeForm.request_amount)"
          class="el-form-item__error"
        >Please provide correct private key</span>
      </el-form-item>
      <span class="form-item-text">
        Market price:
        <span v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset && exchangeDialogPrice" class="form-item-text-amount">
          1 {{ exchangeDialogOfferAsset }} ≈ {{ exchangeDialogPrice }} {{ exchangeDialogRequestAsset }}
        </span>
        <span v-else>...</span>
      </span>
      <el-form-item label="Counterparty" prop="to">
        <el-input
          v-model="$v.exchangeForm.to.$model"
          placeholder="Account id"
          :class="[
            _isValid($v.exchangeForm.to) ? 'border_success' : '',
            _isError($v.exchangeForm.to) ? 'border_fail' : ''
          ]"
        />
        <span
          v-if="_isError($v.exchangeForm.to)"
          class="el-form-item__error"
        >Please provide correct private key</span>
      </el-form-item>
      <el-form-item label="Additional information" prop="description">
        <el-input
          type="textarea"
          :rows="2"
          v-model="$v.exchangeForm.description.$model"
          placeholder="Description"
          resize="none"
          :class="[
            _isValid($v.exchangeForm.description) ? 'border_success' : '',
            _isError($v.exchangeForm.description) ? 'border_fail' : ''
          ]"
        />
        <span
          v-if="_isError($v.exchangeForm.description)"
          class="el-form-item__error"
        >Please provide correct private key</span>
      </el-form-item>
    </el-form>
    <el-button
      class="dialog-form_buttons action"
      @click="onSubmitExchangeDialog()"
      style="margin-top: 40px"
      :loading="isExchangeSending"
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
  _usernameWithDomain,
  _amount,
  errorHandler
} from '@/components/mixins/validation'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'exchange-modal',
  mixins: [
    messageMixin,
    numberFormat,
    errorHandler
  ],
  validations () {
    const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
    const { amount, precision } = wallet || { amount: 0, precision: 0 }
    return {
      exchangeForm: {
        to: {
          required,
          _usernameWithDomain
        },
        request_amount: {
          required,
          _amount: _amount({ amount, precision }, this.exchangeDialogRequestAsset)
        },
        offer_amount: {
          required,
          _amount: _amount(wallet, this.exchangeDialogOfferAsset)
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
      'accountQuorum'
    ]),

    assetsWithoutOffer () {
      return this.wallets.filter(a => a.asset !== this.exchangeDialogOfferAsset)
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
              // TODO: think, maybe it is a bad idea to close form after success.
              Object.assign(
                this.$data.exchangeForm,
                this.$options.data().exchangeForm
              )
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Withdrawal error')
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
