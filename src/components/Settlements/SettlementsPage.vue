<template>
  <section>
    <el-row>
      <el-col :xs="24" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
        <el-card>
          <div slot="header" class="header">
            <div>
              <router-link to="/settlements/">Waiting</router-link>
              <router-link to="/settlements/history">History</router-link>
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
          <el-button type="primary">Create settlement</el-button>
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
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
