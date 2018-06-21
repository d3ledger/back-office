<template>
  <el-container>
    <el-aside class="column-fullheight settlement-form-wrapper" width="400px">
      <el-form style="width: 100%">
        <h2 style="margin-bottom: 40px">New Settlement</h2>
        <el-form-item label="I send" prop="amount">
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
            Available balance:
            <span v-if="settlementForm.request_asset" class="form-item-text-amount">
              {{ wallets.filter(x => x.asset === settlementForm.request_asset)[0].amount  + ' ' + settlementForm.request_asset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="I receive" prop="amount">
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
            Market price:
            <span v-if="settlementForm.request_asset && settlementForm.offer_asset" class="form-item-text-amount">
              1 {{ settlementForm.request_asset.toUpperCase() }} ≈ 0.774231451 {{ settlementForm.offer_asset.toUpperCase() }}
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
      <el-button class="clickable">EXCHANGE</el-button>
    </el-aside>

    <el-container class="column-fullheight">
      <el-header height="60px" class="header">
        <div style="display: flex">
          <router-link class="navlink" to="/settlements">History</router-link>
          <router-link class="navlink" to="/settlements/incoming">Incoming</router-link>
          <router-link class="navlink" to="/settlements/outgoing">Outgoing</router-link>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
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

  methods: {
    onCreateSettlement () {
      const s = this.newSettlementForm

      this.$store.dispatch('createSettlement', {
        to: s.to,
        offerAssetId: s.offer_asset,
        offerAmount: s.offer_amount,
        requestAssetId: s.request_asset,
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
            this.$data.newSettlementForm,
            this.$options.data().newSettlementForm
          )
          this.newSettlementFormVisible = false
        })
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  padding: 0;
  box-shadow: 0 1px 1px 0 #efefef
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

.navlink.router-link-exact-active {
  color: black;
  background: #f4f4f4;
  padding-bottom: 24px;
  border-bottom: 1px solid #2d2d2d;
}

.settlement-form-wrapper {
  background: #669dd5;
  color: white;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.form-item-text {
  font-size: 14px;
  opacity: 0.7;
}

.form-item-text-amount {
  font-weight: 500;
}

.settlement-form-wrapper >>> .el-form-item__label {
  color: white;
}

/* For some reason, '.settlement-form-wrapper >>> .el-input__inner, .el-textarea__inner' isn't working :( */
.settlement-form-wrapper >>> .el-input__inner {
  border-color: rgba(255, 255, 255, 0.5);
  background: #669dd5;
  color: white;
}

.settlement-form-wrapper >>> .el-textarea__inner {
  border-color: rgba(255, 255, 255, 0.5);
  background: #669dd5;
  color: white;
}

.settlement-form-wrapper >>> .el-input__inner:focus {
  border-color: white !important;
  background-color: rgba(255, 255, 255, 0.08);
}

.settlement-form-wrapper >>> .el-textarea__inner:focus {
  border-color: white !important;
  background-color: rgba(255, 255, 255, 0.08);
}

.settlement-form-wrapper >>> .el-input--suffix {
  color: black;
}

.settlement-form-wrapper >>> .el-button {
  color: white;
  background: #041820;
  border: 1px solid #041820;
  width: 100%;
}
</style>
