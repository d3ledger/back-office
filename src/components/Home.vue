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
      <el-form ref="settlementForm" :model="settlementForm" :rules="rules">
        <el-form-item label="I send" prop="offer_amount" >
          <el-input name="amount" v-model="settlementForm.offer_amount" placeholder="0">
            <el-select
              v-model="exchangeDialogOfferAsset"
              @change="getOfferToRequestPrice()"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.asset"
                :label="wallet.asset"
                :value="wallet.asset">
                  <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
              </el-option>
            </el-select>
          </el-input>
          <span class="form-item-text">
            Available balance:
            <span v-if="exchangeDialogOfferAsset" class="form-item-text-amount">
              {{ wallets.filter(x => x.asset === exchangeDialogOfferAsset)[0].amount + ' ' + exchangeDialogOfferAsset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="I receive" prop="request_amount">
          <el-input name="amount" v-model="settlementForm.request_amount" placeholder="0">
            <el-select
              v-model="exchangeDialogRequestAsset"
              @change="getOfferToRequestPrice()"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.asset"
                :label="wallet.asset"
                :value="wallet.asset">
                  <span style="float: left">{{ `${wallet.name} (${wallet.asset})` }}</span>
              </el-option>
            </el-select>
          </el-input>
          <span class="form-item-text">
            Market price:
            <span v-if="exchangeDialogRequestAsset && exchangeDialogOfferAsset" class="form-item-text-amount">
              1 {{ exchangeDialogOfferAsset.toUpperCase() }} ≈ {{ exchangeDialogPrice }} {{ exchangeDialogRequestAsset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="Counterparty" prop="to">
          <el-input v-model="settlementForm.to" placeholder="Account id" />
        </el-form-item>
        <el-form-item label="Additional information">
          <el-input
            type="textarea"
            :rows="2"
            v-model="settlementForm.description"
            placeholder="Account id"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="fullwidth black clickable"
        @click="onSubmitSettlementForm  ()"
        style="margin-top: 40px"
      >
        EXCHANGE
      </el-button>
    </el-dialog>
    <el-dialog
      title="Approve transaction"
      width="500px"
      :visible="approvalDialogVisible"
      @close="closeApprovalDialogWith()"
      center
      >
      <el-form ref="approvalForm" :model="approvalForm" :rules="rules">
        <el-form-item>
          Please enter your private key to confirm transaction
        </el-form-item>
        <el-form-item prop="privateKey" label="Private key">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">

              <el-input
                name="privateKey"
                placeholder="Your private key"
                v-model="privateKey"
              />
            </el-col>

            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChosen"
              >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
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
import inputValidation from '@/components/mixins/inputValidation'

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
      privateKey: null,
      isCollapsed: true,
      settlementForm: {
        to: null,
        request_amount: null,
        offer_amount: null,
        description: null
      },
      approvalForm: {
        privateKey: null
      }
    }
  },

  computed: {
    ...mapGetters([
      'wallets',
      'approvalDialogVisible',
      'exchangeDialogVisible',
      'exchangeDialogPrice'
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

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
    this.$store.dispatch('loadSettings')
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
      this.approvalForm.privateKey = null
    },

    submitApprovalDialog () {
      this.$refs['approvalForm'].validate(valid => {
        if (!valid) return
        this.closeApprovalDialog(this.approvalForm.privateKey)
        this.approvalForm.privateKey = null
      })
    },

    closeExchangeDialogWith () {
      this.closeExchangeDialog()
      this.settlementForm = {
        to: null,
        request_amount: null,
        request_asset: null,
        offer_amount: null,
        offer_asset: null,
        description: null
      }
    },

    onSubmitSettlementForm () {
      const s = this.settlementForm
      this.$refs['settlementForm'].validate(valid => {
        if (!valid) return
        this.openApprovalDialog()
          .then(privateKey => {
            if (!privateKey) return
            const offerAsset = this.exchangeDialogOfferAsset
            const requestAsset = this.exchangeDialogRequestAsset
            return this.$store.dispatch('createSettlement', {
              privateKey,
              to: s.to,
              offerAssetId: offerAsset,
              offerAmount: s.offer_amount,
              requestAssetId: requestAsset,
              requestAmount: s.request_amount
            })
              .then(() => {
                this.$message('New settlement has successfully been created')
              })
              .catch(err => {
                console.error(err)
                this.$message('Failed to create new settlement')
              })
              .finally(() => {
                Object.assign(
                  this.$data.settlementForm,
                  this.$options.data().settlementForm
                )
                this.closeExchangeDialogWith()
              })
          })
      })
    },

    onFileChosen (file, fileList) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        this.privateKey = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
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
</style>
