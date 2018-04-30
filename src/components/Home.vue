<template>
  <el-container>
    <el-header style="display: flex; justify-content: space-between">
      <div>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/settings">Settings</router-link>
      </div>
      <div>
        <el-button plain round type="primary" @click="newSettlementVisible = true">New Settlement</el-button>
        <el-button plain round type="primary" @click="newTransferVisible = true">New Transfer</el-button>
      </div>
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
  align-items: center;
}

a {
  margin-right: 1rem;
  text-decoration: none;
  font-weight: 500;
  color: black;
  transition: opacity .15s ease-in-out;

  &:active {
    text-decoration: none;
  }

  &:hover {
    opacity: 0.8;
  }

  &:visited {
    color: black;
  }
}

a.router-link-exact-active {
  color: #409eff;
}
</style>
