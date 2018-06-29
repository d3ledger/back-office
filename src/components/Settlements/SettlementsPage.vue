<template>
  <section>
    <el-row>
      <el-col :xs="24" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
        <el-card>
          <div slot="header" class="header">
            <div style="display: flex">
              <router-link class="navlink" to="/settlements/">Waiting</router-link>
              <router-link class="navlink" to="/settlements/history">History</router-link>
            </div>
            <div>
              <el-button type="primary" @click="newSettlementFormVisible = true">New settlement</el-button>
            </div>
          </div>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navlink {
  display: inline-block;
  color: #606266;
  font-size: 14px;
  line-height: 1;
  padding: 12px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.navlink:first-child{
  border-radius: 4px 0 0 4px;
  border-right: none;
}

.navlink:last-child{
  border-radius: 0 4px 4px 0;
  border-left: none;
}

.navlink.router-link-exact-active{
  color: white;
  border: 1px solid #409EFF;
  background: #409EFF;
}

.el-select-dropdown__item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
