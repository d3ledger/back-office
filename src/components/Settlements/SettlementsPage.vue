<template>
  <div style="display: flex; flex-direction: row;">
    <!-- <section class="column-fullheight" style="width: 300px; background: #669dd5;">
      Keppa
    </section> -->
    <section class="column-fullheight" style="width: 100%">

      <div class="header">
        <div style="display: flex">
          <router-link class="navlink" to="/settlements">History</router-link>
          <router-link class="navlink" to="/settlements/incoming">Incoming</router-link>
          <router-link class="navlink" to="/settlements/outgoing">Outgoing</router-link>
        </div>
      </div>
      <el-card style="margin: 20px">
        <router-view />
      </el-card>

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
  </div>
</template>

<script>
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
  display: block;
  width: 100%;
  box-shadow: 0 1px 1px 0 #efefef
}

.navlink {
  display: inline-block;
  color: rgba(0,0,0,0.32);
  font-size: 14px;
  line-height: 1;
  padding: 25px 50px;
  border-right: 1px solid #f4f4f4;
  font-weight: 500;
}

.navlink.router-link-exact-active{
  color: black;
  background: #f4f4f4;
  padding-bottom: 24px;
  border-bottom: 1px solid #2d2d2d;
}
</style>
