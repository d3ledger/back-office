<template>
  <el-container>
    <Menu :quorum='accountQuorum'/>
    <el-main style="width: 100%; height: 100vh; padding: 0; padding-left: 62px;">
      <router-view />
    </el-main>
    <el-dialog
      title="Exchange"
      width="450px"
      top="2vh"
      :visible="exchangeDialogVisible"
      @close="closeExchangeDialogWith()"
      center
    >
      <el-form ref="exchangeForm" :model="exchangeForm" class="exchange_form" :rules="rules">
        <el-form-item label="I send" prop="offer_amount" >
          <el-input name="amount" v-model="exchangeForm.offer_amount" placeholder="0">
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
        </el-form-item>
        <span class="form-item-text">
          Available balance:
          <span v-if="exchangeDialogOfferAsset" class="form-item-text-amount">
            {{ wallets.find(x => x.asset === exchangeDialogOfferAsset).amount | formatPrecision }} {{ exchangeDialogOfferAsset }}
          </span>
          <span v-else>...</span>
        </span>
        <el-form-item label="I receive" prop="request_amount">
          <el-input name="amount" v-model="exchangeForm.request_amount" placeholder="0">
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
        </el-form-item>
        <span class="form-item-text">
          Market price:
          <span v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset && exchangeDialogPrice" class="form-item-text-amount">
            1 {{ exchangeDialogOfferAsset }} ≈ {{ exchangeDialogPrice }} {{ exchangeDialogRequestAsset }}
          </span>
          <span v-else>...</span>
        </span>
        <el-form-item label="Counterparty" prop="to">
          <el-input v-model="exchangeForm.to" placeholder="Account id" />
        </el-form-item>
        <el-form-item label="Additional information" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            v-model="exchangeForm.description"
            placeholder="Description"
            resize="none"
          />
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
    <confirm-modal/>
  </el-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import inputValidation from '@/components/mixins/inputValidation'
import numberFormat from '@/components/mixins/numberFormat'
import messageMixin from '@/components/mixins/message'
import NOTIFICATIONS from '@/data/notifications'

// TODO: Validate lack of selected asset
export default {
  name: 'Home',
  mixins: [
    messageMixin,
    numberFormat,
    inputValidation({
      to: 'nameDomain',
      request_amount: 'tokensAmount',
      offer_amount: 'tokensAmount',
      description: 'additionalInformation'
    })
  ],
  components: {
    Menu: lazyComponent('Home/Menu'),
    ConfirmModal: lazyComponent('common/modals/ConfirmModal')
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

    ...mapState({
      accountId: (state) => state.Account.accountId
    }),

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

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
    this.$store.dispatch('loadSettings')
  },

  beforeUpdate () {
    const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
    const { amount, precision } = wallet || { amount: 0, precision: 0 }
    this._refreshRules({
      offer_amount: {
        pattern: 'tokensAmount',
        amount: amount,
        precision: precision,
        asset: this.exchangeDialogOfferAsset
      },
      request_amount: {
        pattern: 'tokensAmount',
        amount: Number.MAX_SAFE_INTEGER,
        precision: precision,
        asset: this.exchangeDialogRequestAsset
      }
    })
  },

  updated () {
    if (this.$refs.exchangeForm && !this.exchangeDialogVisible) {
      this.$refs.exchangeForm.resetFields()
    }
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'closeExchangeDialog',
      'getOfferToRequestPrice'
    ]),

    closeExchangeDialogWith () {
      this.closeExchangeDialog()
      this.exchangeForm.description = ''
      this.exchangeDialogOfferAsset = ''
      this.exchangeDialogRequestAsset = ''
    },

    onSubmitExchangeDialog () {
      const s = this.exchangeForm
      this.$refs.exchangeForm.validate(valid => {
        if (!valid) return

        this.openApprovalDialog()
          .then(privateKeys => {
            if (!privateKeys) return
            this.isExchangeSending = true
            const offerAsset = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset).assetId
            const requestAsset = this.wallets.find(x => x.asset === this.exchangeDialogRequestAsset).assetId
            return this.$store.dispatch('createSettlement', {
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
      })
    }
  }
}
</script>

<style>

.item__private-keys {
  width: 40px;
  height: 40px;
  border-radius: 24px;
  border: solid 1px #cccccc;
  display: flex;
  justify-content: center;
}

.item__private-keys-success {
  border: solid 1px #67c23a;
}

/* in order not to make a border green when a private key is empty */
.el-form-item.is-success .el-input.is-empty .el-input__inner {
  border-color: #dcdfe6;
}
.approval_form-desc {
  text-align: center;
}

.approval_form-item-clearm {
  margin: 0;
}

.approval_form .el-input__inner {
  background-color: #ffffff;
  color: #000000;
  border: solid 1px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  height: 4.5rem;
  padding-left: 1.2rem;
  padding-top: 1.2rem;
  line-height: 0;
  font-size: 1rem;
}

.approval_form .el-form-item__label {
  line-height: 1;
  position: relative;
  top: 2rem;
  z-index: 10;
  margin-left: 1.2rem;
  font-size: 0.8rem;
  opacity: 0.56;
  color: #000000;
}
.approval_form-upload .el-button,
.approval_form-upload .el-button:focus {
  width: 3.8rem;
  height: 4.5rem;
  border: solid 1px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.2);
  padding: 0;
  font-size: 1.2rem;
  border-radius: 0.3rem;
}

.approval_form-upload .el-button:hover {
  border-color: #000000;
  color: #000000;
}

.approval_form-counter {
  margin-top: 1rem;
}

.dialog-form_buttons-block {
  display: flex;
  justify-content: space-between;
}
.dialog-form_buttons {
  height: 3.5rem;
  width: 13.5rem;
  text-transform: uppercase;
  font-size: 0.8rem;
}
.dialog-form_buttons.action {
  background-color: #041820;
  color: #ffffff;
  border: 1px solid #041820;
}
.dialog-form_buttons.action.is-disabled {
  opacity: 0.8;
}
.dialog-form_buttons.action:hover {
  background-color: #041820;
}
.dialog-form_buttons.close {
  color: #000000;
  border: 1px solid #1d1f20;
}
.dialog-form_buttons.close:hover {
  background-color: rgba(0, 0, 0, 0.025);
}
</style>

<style scoped>
.exchange_form >>> .el-form-item__label::before,
.approval_form >>> .el-form-item__label::before {
  content: '';
}
</style>
