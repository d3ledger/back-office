<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="15">
        <transactions-card
          :transactions="transactions"
          v-on:accept-settlement="settlementForApproval = $event; approvalDialogVisible = true"
          v-on:decline-settlement="settlementForDeclining = $event; decliningDialogVisible = true"
        />
      </el-col>
      <el-col :span="9">
        <balance-card
          :wallets="wallets"
          v-on:deposit-money="depositWallet = $event; depositFormVisible = true"
          v-on:withdraw-money="withdrawWallet = $event; withdrawFormVisible = true"
        />
      </el-col>
    </el-row>
    <el-dialog
      title="Deposit"
      :visible.sync="depositFormVisible"
      width="500px"
    >
      <div style="display: flex; align-items: center;" v-if="this.depositWallet">
        <img src="@/assets/qr.png" />
        <div style="padding-left: 20px">
          Scan QR code or send your {{ this.depositWallet.short }} to <strong> {{ this.depositWallet.address }}</strong>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="Withrdaw"
      :visible.sync="withdrawFormVisible"
      width="500px"
    >
      <h3 v-if="withdrawWallet">From: {{ withdrawWallet.name }}</h3>
      <el-form
        label-width="4rem"
        v-if="withdrawWallet"
      >
        <el-form-item label="Amount:" prop="amount">
          <el-input name="amount" v-model="withdrawalForm.amount">
            <template slot="append">{{ withdrawWallet.short }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="To:" prop="to">
          <el-select v-model="withdrawalForm.to" placeholder="Select" style="width: 100%;">
            <el-option
              v-for="item in withdrawalWallets"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
            <el-button type="primary">Transfer</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="Accept settlement?"
      :visible.sync="approvalDialogVisible"
      width="500px"
    >
      <div v-if="settlementForApproval">
        Are you sure want to exchange {{ settlementForApproval.offer_amount + settlementForApproval.offer_asset }}
        for {{ settlementForApproval.request_amount + settlementForApproval.request_asset }} with {{ settlementForApproval.from }}?
      </div>
      <div slot="footer">
        <el-button type="success">Accept</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Decline settlement?"
      :visible.sync="decliningDialogVisible"
      width="500px"
    >
      <div v-if="settlementForDeclining">
        Are you sure want to decline {{ settlementForDeclining.offer_amount + settlementForDeclining.offer_asset }}
        for {{ settlementForDeclining.request_amount + settlementForDeclining.request_asset }} with {{ settlementForDeclining.from }}?
      </div>
      <div slot="footer">
        <el-button type="danger">Decline</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import BalanceCard from '@/components/Dashboard/BalanceCard'
import TransactionsCard from '@/components/Dashboard/TransactionsCard'
import mockTransactions from '@/mocks/transactions.json'

export default {
  name: 'Home',
  components: {
    BalanceCard,
    TransactionsCard
  },
  data () {
    return {
      depositFormVisible: false,
      depositWallet: null,

      withdrawFormVisible: false,
      withdrawWallet: null,
      withdrawalForm: {
        amount: null,
        to: null
      },

      approvalDialogVisible: false,
      settlementForApproval: null,

      decliningDialogVisible: false,
      settlementForDeclining: null,

      withdrawalWallets: [
        'wallet1',
        'wallet2',
        'wallet3'
      ],

      transactions: mockTransactions,
      wallets: [
        {
          name: 'Ether',
          short: 'ETH',
          amount: 100.0,
          address: 'someEthAcountAddress',
          precision: 1
        },
        {
          name: 'Waves',
          short: 'WVS',
          amount: 200.12,
          address: 'someWavesAccountAddress',
          precision: 2
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
