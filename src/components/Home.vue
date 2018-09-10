<template>
  <el-container>
    <Menu :quorum='accountQuorum'/>
    <el-main style="width: 100%; height: 100vh; padding: 0; padding-left: 62px;">
      <router-view />
    </el-main>
    <el-dialog
      title="Exchange"
      width="500px"
      top="2vh"
      :visible="exchangeDialogVisible"
      @close="closeExchangeDialogWith()"
      center
    >
      <el-form ref="exchangeForm" :model="exchangeForm" :rules="rules">
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
                v-for="wallet in wallets"
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
            {{ wallets.find(x => x.asset === exchangeDialogOfferAsset).amount + ' ' + exchangeDialogOfferAsset }}
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
                v-for="wallet in wallets"
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
          <span v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset" class="form-item-text-amount">
            1 {{ exchangeDialogOfferAsset }} ≈ {{ exchangeDialogPrice }} {{ exchangeDialogRequestAsset }}
          </span>
          <span v-else>...</span>
        </span>
        <el-form-item label="Counterparty" prop="to">
          <el-input v-model="exchangeForm.to" placeholder="Account id" />
        </el-form-item>
        <el-form-item label="Additional information">
          <el-input
            type="textarea"
            :rows="2"
            v-model="exchangeForm.description"
            placeholder="Account id"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="fullwidth black clickable"
        @click="onSubmitExchangeDialog()"
        style="margin-top: 40px"
        :loading="isExchangeSending"
      >
        EXCHANGE
      </el-button>
    </el-dialog>
    <el-dialog
      title="Confirm the transaction"
      width="500px"
      :visible="approvalDialogVisible"
      @close="closeApprovalDialogWith()"
      center
      >
      <el-form ref="approvalForm" :model="approvalForm" :rules="rules">
        <el-form-item>
          <el-row type="flex" justify="center">
            Please enter your private key
          </el-row>
        </el-form-item>
        <template v-for="(quorum, index) in accountQuorum">
          <el-form-item :key="quorum">
            <el-row type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  name="privateKeys"
                  placeholder="Your private key"
                  v-model="approvalForm.privateKeys[index]"
                  @change="(key) => insertPrivateKey(key, index)"
                />
              </el-col>
              <el-upload
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(f, l) => onFileChosen(f, l, index)"
                >
                <el-button>
                  <fa-icon icon="upload" />
                </el-button>
              </el-upload>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item v-if="accountQuorum > 1">
          <el-row type="flex" justify="center">
            <div class="item__private-keys">
              {{ approvalForm.privateKeys | nonEmptyKeys }}/{{ accountQuorum }}
            </div>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button
            class="fullwidth black clickable"
            @click="submitApprovalDialog()"
            >
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import inputValidation from '@/components/mixins/inputValidation'

// TODO: Validate lack of selected asset
export default {
  name: 'Home',
  mixins: [
    inputValidation({
      privateKey: 'privateKey',
      to: 'nameDomain',
      request_amount: 'tokensAmount',
      offer_amount: 'tokensAmount'
    })
  ],
  components: {
    Menu: lazyComponent('Home/Menu')
  },
  data () {
    return {
      exchangeForm: {
        to: null,
        request_amount: '',
        offer_amount: '',
        description: null
      },
      approvalForm: {
        privateKeys: []
      },
      isExchangeSending: false
    }
  },

  computed: {
    ...mapGetters([
      'wallets',
      'approvalDialogVisible',
      'exchangeDialogVisible',
      'exchangeDialogPrice',
      'accountQuorum'
    ]),

    ...mapState({
      accountId: (state) => state.Account.accountId
    }),

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
      return this.$store.getters.waitingSettlements.length
    }
  },

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
    this.$store.dispatch('loadSettings')
  },

  beforeUpdate () {
    if (this.exchangeDialogOfferAsset) {
      const wallet = this.wallets.find(x => x.asset === this.exchangeDialogOfferAsset)
      this._refreshRules({
        offer_amount: { pattern: 'tokensAmount', amount: wallet.amount, precision: wallet.precision },
        request_amount: { pattern: 'tokensAmount', amount: Number.MAX_SAFE_INTEGER, precision: wallet.precision }
      })
    }
  },

  updated () {
    if (this.$refs.exchangeForm && !this.exchangeDialogVisible) {
      this.$refs.exchangeForm.resetFields()
    }
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'closeApprovalDialog',
      'closeExchangeDialog',
      'getOfferToRequestPrice'
    ]),

    insertPrivateKey (key, i) {
      this.$set(this.approvalForm.privateKeys, i, key)
    },

    closeApprovalDialogWith () {
      this.closeApprovalDialog()
      // TODO: Fix validation of private key fields
      // this.$refs.approvalForm.resetFields()
      this.approvalForm.privateKeys = []
    },

    submitApprovalDialog () {
      // TODO: Fix validation of private key fields
      this.$refs.approvalForm.validate(valid => {
        if (!valid) return
        this.closeApprovalDialog(this.approvalForm.privateKeys)
      })
    },

    closeExchangeDialogWith () {
      this.closeExchangeDialog()
      this.exchangeForm.description = ''
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
              requestAmount: s.request_amount
            })
              .then(() => {
                this.$message('New settlement has successfully been created')
                this.closeExchangeDialogWith()
                // TODO: think, maybe it is a bad idea to close form after success.
                Object.assign(
                  this.$data.exchangeForm,
                  this.$options.data().exchangeForm
                )
              })
              .catch(err => {
                console.error(err)
                this.$alert(err.message, 'Withdrawal error', {
                  type: 'error'
                })
              })
              .finally(() => {
                this.isExchangeSending = false
              })
          })
      })
    },

    onFileChosen (file, fileList, i) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        this.$set(this.approvalForm.privateKeys, i, (ev.target.result || '').trim())
      }
      reader.readAsText(file.raw)
    }
  },

  filters: {
    nonEmptyKeys (value) {
      if (!value) return ''
      return value.filter(key => key.length).length
    }
  }
}
</script>

<style>
.logo {
  height: 62px;
  background-color: #e43c34;
  margin-bottom: 100px;
}

.logo img {
  height: 62px;
  width: 62px;
}

.item__private-keys {
  width: 40px;
  height: 40px;
  border-radius: 24px;
  border: solid 1px #cccccc;
  display: flex;
  justify-content: center;
}
</style>
