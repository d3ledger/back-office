<template>
    <el-container class="column-fullheight">
      <el-header height="59px" class="header">
        <el-row>
          <el-col :xs="24" :md="{ span: 20, offset: 2 }" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }"
            style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
          >
            <div style="display: flex;">
              <router-link class="navlink" to="/settlements/history">History</router-link>
              <router-link class="navlink" to="/settlements/incoming">Incoming</router-link>
              <router-link class="navlink" to="/settlements/outgoing">Outgoing</router-link>
            </div>
            <div>
              <el-button type="primary" @click="settlementFormVisible = true" plain>
                <span style="vertical-align: middle;">
                  <fa-icon icon="exchange-alt" />
                  Exchange
                </span>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <el-col :xs="24" :md="{ span: 20, offset: 2 }" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
            <router-view />
          </el-col>
        </el-row>
      </el-main>
    <el-container>
    <el-dialog
      title="Exchange"
      width="400px"
      :visible.sync="settlementFormVisible"
      center
    >
      <el-form style="width: 100%">
        <el-form-item label="I send" prop="amount">
          <el-input name="amount" v-model="settlementForm.offer_amount" placeholder="0">
            <el-select
              v-model="settlementForm.offer_asset"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.asset"
                :label="wallet.asset"
                :value="wallet.asset">
                  <span style="float: left">{{ wallet.name + ' (' + wallet.asset + ')' }}</span>
              </el-option>
            </el-select>
          </el-input>
          <span class="form-item-text">
            Available balance:
            <span v-if="settlementForm.offer_asset" class="form-item-text-amount">
              {{ wallets.filter(x => x.asset === settlementForm.offer_asset)[0].amount  + ' ' + settlementForm.offer_asset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="I receive" prop="amount">
          <el-input name="amount" v-model="settlementForm.request_amount" placeholder="0">
            <el-select
              v-model="settlementForm.request_asset"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.asset"
                :label="wallet.asset"
                :value="wallet.asset">
                  <span style="float: left">{{ wallet.name + ' (' + wallet.asset + ')' }}</span>
              </el-option>
            </el-select>
          </el-input>
          <span class="form-item-text">
            Market price:
            <span v-if="settlementForm.request_asset && settlementForm.offer_asset" class="form-item-text-amount">
              1 {{ settlementForm.offer_asset.toUpperCase() }} ≈ 0.774231451 {{ settlementForm.request_asset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="Counterparty">
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
        @click="onSubmitSettlementForm"
        style="margin-top: 40px"
      >
        EXCHANGE
      </el-button>
    </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
// TODO: Mirror everything onto query params
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      settlementFormVisible: false,
      settlementForm: {
        to: null,
        request_amount: null,
        request_asset: null,
        offer_amount: null,
        offer_asset: null,
        description: null
      }
    }
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets'
    })
  },

  mounted () {
    if (this.$route.query.exchange) {
      this.settlementFormVisible = true
      this.settlementForm.offer_asset = this.$route.query.offer_asset
    }
  },

  methods: {
    ...mapActions([
      'openApprovalDialog'
    ]),
    onSubmitSettlementForm () {
      const s = this.settlementForm

      this.openApprovalDialog()
        .then(privateKey => {
          console.log(`settlement: privateKey=${privateKey}`)

          return this.$store.dispatch('createSettlement', {
            privateKey,
            to: s.to,
            offerAssetId: s.offer_asset,
            offerAmount: s.offer_amount,
            requestAssetId: s.request_asset,
            requestAmount: s.request_amount
          })
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
          this.settlementFormVisible = false
        })
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  padding: 0 20px;
  box-shadow: 0 1px 1px 0 #efefef;
}

.navlink {
  display: inline-block;
  color: rgba(0,0,0,0.32);
  font-size: 14px;
  line-height: 1;
  padding: 20px 50px;
  border-right: 1px solid #f4f4f4;
  font-weight: 500;
}

.navlink.router-link-active {
  color: black;
  background: #f4f4f4;
  padding-bottom: 24px;
  border-bottom: 1px solid #2d2d2d;
}
</style>
