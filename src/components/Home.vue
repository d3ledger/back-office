<template>
  <el-container>
    <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
      <el-menu
        :router="true"
        :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
        text-color="#a2a2a2"
        background-color="#2D2D2D"
        active-text-color="#000"
        :default-active="currentActiveMenu"
        >
        <h1 class="logo">D3</h1>
        <el-menu-item index="/">
          <fa-icon icon="chart-line" class="menu-icon" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/wallets">
          <fa-icon icon="wallet" class="menu-icon" />
          <span slot="title">Wallets</span>
        </el-menu-item>
        <el-menu-item index="/settlements/history">
          <fa-icon icon="exchange-alt" class="menu-icon" />
          <span slot="title">Settlements</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <fa-icon icon="file-invoice" class="menu-icon" />
          <span slot="title">Reports</span>
        </el-menu-item>
        <el-menu-item v-if="accountQuorum > 1" index="/transactions">
          <fa-icon icon="clock" class="menu-icon" />
          <span slot="title">Transactions</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <fa-icon icon="cog" class="menu-icon" />
          <span slot="title">Settings</span>
        </el-menu-item>
        <el-menu-item index="/logout" @click="logout">
          <fa-icon icon="sign-out-alt" class="menu-icon" />
          <span slot="title">Logout</span>
        </el-menu-item>
      </el-menu>
    </div>
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
      id="approval-dialog"
      title="Confirm the transaction"
      width="500px"
      :visible="approvalDialogVisible"
      @close="closeApprovalDialogWith()"
      center
    >
      <el-form ref="approvalForm" :model="approvalForm" @validate="updateNumberOfValidKeys">
        <el-form-item>
          <el-row type="flex" justify="center">
            <p>
              Please enter your private key<span v-if="accountQuorum > 1">s</span>.
              <br>
              (You need to enter at least 1 key)
            </p>
            <p v-if="approvalForm.numberOfSignatures">This transaction already has {{approvalForm.numberOfSignatures}} signature<span v-if="approvalForm.numberOfSignatures > 1">s</span></p>
          </el-row>
        </el-form-item>

        <el-form-item
          v-for="(key, index) in approvalForm.privateKeys"
          :key="index"
          :prop="`privateKeys.${index}.hex`"
          :rules="rules.privateKey"
        >
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                placeholder="Your private key"
                v-model="key.hex"
                :class="{ 'is-empty': !key.hex }"
              />
            </el-col>

            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(f, l) => onFileChosen(f, l, key)"
              >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
          </el-row>
        </el-form-item>

        <el-form-item v-if="accountQuorum > 1">
          <el-row type="flex" justify="center">
            <div class="item__private-keys">
              {{ approvalForm.numberOfValidKeys + approvalForm.numberOfSignatures }}/{{ accountQuorum }}
            </div>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button
            id="confirm-approval-form"
            class="fullwidth black clickable"
            @click="submitApprovalDialog()"
            :disabled="approvalForm.numberOfValidKeys < 1"
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
  data () {
    return {
      isCollapsed: true,
      exchangeForm: {
        to: null,
        request_amount: '',
        offer_amount: '',
        description: null
      },
      approvalForm: {
        privateKeys: [],
        numberOfValidKeys: 0,
        numberOfSignatures: 0
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
    },

    currentActiveMenu: function () {
      if (this.$route.path.includes('wallets')) return '/wallets'
      if (this.$route.path.includes('settlements')) return '/settlements/history'
      return this.$route.path
    }
  },

  watch: {
    approvalDialogVisible (isVisible) {
      if (isVisible) this.beforeOpenApprovalDialog()
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

    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    },

    closeApprovalDialogWith () {
      this.closeApprovalDialog()
      this.$refs.approvalForm.resetFields()
    },

    submitApprovalDialog () {
      this.$refs.approvalForm.validate(valid => {
        if (!valid) return
        this.closeApprovalDialog(this.approvalForm.privateKeys.map(x => x.hex).filter(x => !!x))
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

    beforeOpenApprovalDialog () {
      const privateKeys = Array.from({ length: this.accountQuorum }, () => ({ hex: '' }))
      this.$set(this.approvalForm, 'privateKeys', privateKeys)
      this.updateNumberOfValidKeys()
    },

    onFileChosen (file, fileList, key) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        key.hex = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
    },

    updateNumberOfValidKeys () {
      if (!this.$refs.approvalForm) return

      this.approvalForm.numberOfValidKeys = this.$refs.approvalForm.fields.filter(x => {
        return x.validateState === 'success' && !!x.fieldValue
      }).length
    }
  }
}
</script>

<style>
.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-right: none;
  z-index: 100;
  width: 62px;

  /* Getting rid of element.ui styles */
  position: fixed !important;
  border-right: none !important;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 160px;
}

.el-side-menu > .el-menu-item.is-active{
  background: white !important;
  color: black;
}

.logo {
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
}

.menu-icon {
  margin-left: 2px;
  margin-right: 8px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.item__private-keys {
  width: 40px;
  height: 40px;
  border-radius: 24px;
  border: solid 1px #cccccc;
  display: flex;
  justify-content: center;
}

/* in order not to make a border green when a private key is empty */
.el-form-item.is-success .el-input.is-empty .el-input__inner {
  border-color: #dcdfe6;
}
</style>
