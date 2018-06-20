<template>
  <el-container>
    <el-menu
      :collapse="isCollapsed"
      class="el-side-menu"
      :router="true"
      background-color="#2d2d2d"
      text-color="#a2a2a2"
      active-text-color="#fff"
      :default-active="$router.history.current.path.includes('wallets') ? '/wallets' : $router.history.current.path"
    >
      <h1 class="logo">D3</h1>
      <el-menu-item index="/">
        <i class="el-icon-menu" />
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/wallets">
        <i class="el-icon-news" />
        <span slot="title">Wallets</span>
      </el-menu-item>
      <el-menu-item index="/settlement">
        <i class="el-icon-refresh" />
        <span slot="title">Settlement</span>
      </el-menu-item>
      <el-menu-item index="/transfer">
        <i class="el-icon-d-arrow-right" />
        <span slot="title">Transfer</span>
      </el-menu-item>
      <el-menu-item index="/report">
        <i class="el-icon-tickets" />
        <span slot="title">Report</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-setting" />
        <span slot="title">Profile</span>
      </el-menu-item>
      <div class="expand-button clickable" @click="isCollapsed = !isCollapsed">
        <i :class="isCollapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
      </div>
    </el-menu>
    <main style="width: 100%; height: 100vh;">
      <router-view/>
    </main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'

// TODO: Validate lack of selected asset
export default {
  name: 'Home',
  mixins: [
    numberFormat,
    inputValidation({
      privateKey: 'repeatingPrivateKey',
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
        privateKeys: [],
        numberOfValidKeys: 0
      },
      isExchangeSending: false
    }
  },

  data () {
    return {
      isCollapsed: false
    }
  },

  computed: {
    numberOfSettlements () {
      return this.$store.getters.waitingSettlements.length
    },

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
      return this.$store.getters.incomingSettlements.length
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

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
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
                let message = completed
                  ? 'New settlement has successfully been created!'
                  : 'Operation not completed. You should complete it on transactions page'

                let type = completed
                  ? 'success'
                  : 'warning'

                this.$message({
                  message,
                  type
                })

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
      const privateKeys = Array.from({ length: this.accountQuorum - this.approvalDialogSignatures.length }, () => ({ hex: '' }))
      this.$set(this.approvalForm, 'privateKeys', privateKeys)
      this.updateNumberOfValidKeys()

      this._refreshRules({
        repeatingPrivateKey: { pattern: 'repeatingPrivateKey', keys: this.approvalDialogSignatures }
      })
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
    },

    disableConfig () {
      if (this.exchangeDialogVisible) {
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.accountQuorum)
      } else {
        if (this.approvalDialogMinAmountKeys === 1) {
          return this.approvalForm.numberOfValidKeys < 1
        }
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.approvalDialogMinAmountKeys)
      }
    }
  }
}
</script>

<style lang="scss">
.expand-button {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #669dd5;
  font-size: 18px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.el-side-menu.el-menu--collapse {
  min-width: 62px;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-side-menu > .el-menu-item.is-active{
  background: #669dd5 !important;
}

.logo {
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
}
</style>
