<template>
  <el-container class="column-fullheight">
    <el-header class="header" :style="{ height: '3.9rem' }">
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
            <el-button class="exchange_button" type="primary" @click="openExchangeDialog()">
              <fa-icon class="exchange_button-icon" icon="exchange-alt" />
              <span>
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
        </el-card>
      </el-col>
    </el-row>

     <el-dialog
      title="New Settlement"
      :visible.sync="newSettlementFormVisible"
      width="500px"
    >
      <el-form label-width="4rem">
        <el-form-item label="I offer:" prop="amount">
          <el-input name="amount" v-model="newSettlementForm.request_amount">
            <el-select
              v-model="newSettlementForm.request_asset"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option label="ETH" value="eth">ETH</el-option>
              <el-option label="WVS" value="wvs">WVS</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="To">
          <el-input v-model="newSettlementForm.to" placeholder="account id" />
        </el-form-item>
        <el-form-item label="For:" prop="amount">
          <el-input name="amount" v-model="newSettlementForm.offer_amount">
            <el-select
              v-model="newSettlementForm.offer_asset"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option label="ETH" value="eth">ETH</el-option>
              <el-option label="WVS" value="wvs">WVS</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary" @click="onCreateSettlement">Create settlement</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      newSettlementFormVisible: false,
      newSettlementForm: {
        to: null,
        request_amount: null,
        request_asset: null,
        offer_amount: null,
        offer_asset: null
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
  padding: 0 20px;
}

.navlink {
  display: inline-block;
  color: rgba(0,0,0,0.32);
  font-size: 0.9rem;
  line-height: 1;
  padding: 20px 50px;
  border-right: 1px solid #f4f4f4;
  font-weight: 600;
}

.navlink.router-link-active {
  color: black;
  background: #f4f4f4;
  padding-bottom: 1.7rem;
  border-bottom: 1px solid #2d2d2d;
}
.exchange_button {
  background-color: #409eff;
  border: 0;
  text-transform: uppercase;
  border-radius: 2px;
  font-size: 0.8rem;
  line-height: 1rem;
}
.exchange_button-icon {
  margin-right: 0.7rem;
}
</style>
