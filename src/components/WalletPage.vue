<template>
  <el-container>
    <el-header height="auto" class="header">
      <el-row>
        <el-col :xs="24" :lg="4" :xl="5">
          <router-link to="/" class="back">
            <i class="el-icon-back" style="margin-right: 5px"></i>
            <span>Wallets</span>
          </router-link>
        </el-col>
        <el-col :xs="24" :lg="16" :xl="14">
          <div class="title">
            <img src="@/assets/icons/coins.svg" class="title-icon"/>
            <h1 class="title-text">
              {{ wallet.name }}
            </h1>
          </div>
          <div class="bottom-wrapper">
            <h2 class="amount"> {{ wallet.amount + ' ' + wallet.asset }}</h2>
            <div>
              <el-button @click="sendFormVisible = true">Send</el-button>
              <el-button @click="receiveFormVisible = true">Receive</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
          <el-card>
            <div slot="header">
              History
            </div>
            <el-table
              :data="transactions"
              ref="table"
              @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
              >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <p>
                    {{ scope.row.from }} transfered  {{ scope.row.amount + ' ' + wallet.asset}} to {{ scope.row.to }}
                  </p>
                  <div v-if="scope.row.settlement" style="background: #F8FFF0">
                    <p>This transaction is a part of a succesfull setllement:</p>
                    <p>{{ scope.row.settlement.from }} exchanged {{ scope.row.settlement.offer_amount + ' ' + scope.row.settlement.offer_asset}} for {{ scope.row.settlement.request_amount + ' ' + scope.row.settlement.request_asset}} with {{ scope.row.settlement.to }}</p>
                    <p>Was <el-tag>created</el-tag> at {{ scope.row.settlement.date | formatDateLong}}</p>
                    <p>Was <el-tag :type="tagType(scope.row.settlement.status)" >{{ scope.row.settlement.status }}</el-tag> at
                    {{ scope.row.settlement.date | formatDateLong}}</p>
                    <p>Message: {{ scope.row.settlement.message }}</p>
                  </div>
                  <div v-else>
                    <p>Was <el-tag>created</el-tag> at {{ scope.row.date | formatDateLong}}</p>
                    <p>Message: {{ scope.row.message }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="100">
                <template slot-scope="scope">
                  {{ (scope.row.from === 'you' ? '- ' : '+ ') + scope.row.amount}}
                </template>
              </el-table-column>
              <el-table-column label="Address" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.from === 'you'">
                    to {{ scope.row.to }}
                  </div>
                  <div v-else>
                    from {{ scope.row.from }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Date" width="120">
                <template slot-scope="scope">
                  {{ scope.row.date | formatDate }}
                </template>
              </el-table-column>
              <el-table-column prop="message" label="Description" min-width="200">
                <template slot-scope="scope">
                  <div v-if="scope.row.settlement">Part of a settlement <i class="el-icon-refresh"></i></div>
                  <div v-else>{{ scope.row.message }}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog
      :title="'Send ' + wallet.asset"
      :visible.sync="sendFormVisible"
      width="500px"
    >
      <el-form label-width="4rem">
        <el-form-item label="Transfer:" prop="amount">
          <el-input name="amount" v-model="sendForm.amount">
            <div slot="append">
              {{ wallet.asset }}
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="To">
          <el-input v-model="sendForm.to" placeholder="account id or address" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button
            type="primary"
            @click="onSubmit"
            :loading="isSending"
          >
            Send
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Receive"
      :visible.sync="receiveFormVisible"
      width="500px"
    >
      <div style="display: flex; align-items: center;">
        <img src="@/assets/qr.png" />
        <div style="padding-left: 20px">
          Scan QR code or send your {{ wallet.asset }} to <strong> {{ wallet.address }}</strong>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [dateFormat],
  data () {
    return {
      wallet: {},
      transactions: [],

      receiveFormVisible: false,
      sendFormVisible: false,
      sendForm: {
        to: '',
        amount: '0'
      },
      isSending: false
    }
  },

  watch: {
    '$route' (to, from) {
      this.fetchWallet()
    }
  },

  created () {
    this.fetchWallet()
  },

  methods: {
    tagType: function (val) {
      val = val.toLowerCase()
      if (val === 'accepted') return 'success'
      if (val === 'rejected') return 'danger'
      if (val === 'canceled') return 'info'
      return ''
    },

    fetchWallet () {
      const walletId = this.$route.params.walletId

      this.wallet = this.$store.getters.wallets.find(w => (w.id === walletId))
      this.$store.dispatch('getAccountAssetTransactions', { assetId: this.wallet.assetId })
        .then(() => {
          this.transactions = this.$store.getters.getTransactionsByAssetId(this.wallet.assetId)
        })
    },

    onSubmit () {
      this.isSending = true
      this.$store.dispatch('transferAsset', {
        assetId: this.wallet.assetId,
        to: this.sendForm.to,
        amount: this.sendForm.amount
      })
        .then(() => {
          this.$message({
            message: 'Transfer successful!',
            type: 'success'
          })
          this.resetSendForm()
          this.fetchWallet()
          this.sendFormVisible = false
        })
        .catch(err => {
          console.error(err)
          this.$alert(err.message, 'Transfer error', {
            type: 'error'
          })
        })
        .finally(() => { this.isSending = false })
    },

    resetSendForm () {
      this.sendForm.to = ''
      this.sendForm.amount = '0'
    }
  }
}
</script>
<style scoped>
.header {
  background-color: #494949;
  padding: 30px 20px;
  color: white;
}

a.back{
  color: white;
  text-decoration: none;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 20px;
  width: auto;
  padding: 5px;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.title-text {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.title-icon {
  width: 40px;
  margin-right: 15px;
}

.bottom-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.amount {
  font-size: 2rem;
  margin: 0;
  margin-right: 20px;
  font-weight: bold;
  display: block;
}
</style>
