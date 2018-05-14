<template>
  <el-container>
    <el-header class="header">
      <el-menu
        default-active="/"
        :router="true"
        mode="horizontal"
      >
        <el-menu-item index="/">Wallets</el-menu-item>
          <el-menu-item index="/settlements">Settlements</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
    <el-dialog
      title="New Settlement"
      :visible.sync="newSettlementVisible"
      width="500px"
    >
      <el-form label-width="4rem">
        <el-form-item label="I offer:" prop="amount">
          <el-input name="amount" v-model="newSettlement.request_amount">
            <el-select
              v-model="newSettlement.request_asset"
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
          <el-input v-model="newSettlement.to" placeholder="account id" />
        </el-form-item>
        <el-form-item label="For:" prop="amount">
          <el-input name="amount" v-model="newSettlement.offer_amount">
            <el-select
              v-model="newSettlement.offer_asset"
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
          <el-button type="primary">Make offer</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="New Transfer"
      :visible.sync="newTransferVisible"
      width="500px"
    >
      <el-form label-width="4rem">
        <el-form-item label="Transfer:" prop="amount">
          <el-input name="amount" v-model="newTransfer.request_amount">
            <el-select
              v-model="newTransfer.offer_asset"
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
          <el-input v-model="newTransfer.to" placeholder="account id" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary">Transfer</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      newSettlementVisible: false,
      newSettlement: {
        to: null,
        request_amount: null,
        request_asset: null,
        offer_amount: null,
        offer_asset: null
      },
      newTransferVisible: false,
      newTransfer: {
        to: null,
        offer_amount: null,
        offer_asset: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background: white;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08)
}
</style>
