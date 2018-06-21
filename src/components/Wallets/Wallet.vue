<template>
  <div>
    <el-row style="margin-bottom: 20px">
      <el-col :xs="24" :lg="{ span: 22, offset: 1 }" :xl="{ span: 20, offset: 2 }">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card body-style="height: 160px;">
              <div slot="header" class="card-header">
                <div>{{ wallet.name }}</div>
                <asset-icon :asset="wallet.asset" :size="17" style="color: black;"/>
              </div>
              <div class="top-left-card-body">
                <h2 class="amount"> {{ wallet.amount + ' ' + wallet.asset }}</h2>
                <div>
                  <el-button type="primary" @click="receiveFormVisible = true" plain>
                    Deposit
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button type="primary" @click="sendFormVisible = true" plain>
                    Withdraw
                    <i class="el-icon-arrow-up"></i>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card body-style="height: 160px;">
              <div slot="header" class="card-header">
                <div>Market <el-tag type="info" size="mini">Today</el-tag></div>
                <i class="el-icon-more-outline" />
              </div>
              <div class="card-info">
              <el-row style="margin-bottom: 20px">
                <el-col :span="12">
                  <p class="card-info-amount">{{ assetInfo.current.rur }} ₽</p>
                  <p style="color: green">{{ assetInfo.current.rur_change }}</p>
                </el-col>
                <el-col :span="12">
                  <p class="card-info-amount">{{ assetInfo.current.btc }} BTC</p>
                  <p style="color: green">{{ assetInfo.current.btc_change }}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <p class="card-info-title">Market Cap</p>
                  <p>{{ assetInfo.market.cap.rur }} ₽</p>
                  <p>{{ assetInfo.market.cap.btc }} BTC</p>
                </el-col>
                <el-col :span="8">
                  <p class="card-info-title">Volume (24h)</p>
                  <p>{{ assetInfo.market.volume.rur }} ₽</p>
                  <p>{{ assetInfo.market.volume.btc }} BTC</p>
                </el-col>
                <el-col :span="8">
                  <p class="card-info-title">Circulating Supply</p>
                  <p> {{ assetInfo.market.supply + ' ' + wallet.asset }} </p>
                </el-col>
              </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :lg="{ span: 22, offset: 1 }" :xl="{ span: 20, offset: 2 }">
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
                {{ (scope.row.from === 'you' ? '- ' : '+ ') + Number(scope.row.amount).toFixed(4)}}
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
  </div>
</template>

<script>
import AssetIcon from '@/components/common/AssetIcon'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  name: 'wallet',
  mixins: [dateFormat],
  components: {
    AssetIcon
  },
  data () {
    return {
      receiveFormVisible: false,
      sendFormVisible: false,
      sendForm: {
        to: '',
        amount: '0'
      },
      isSending: false,
      assetInfo: {
        current: {
          rur: 37705.68,
          rur_change: '+450 ₽ (1.02 %)',
          btc: 0.07928230,
          btc_change: '+0.0000043 ₽ (0.28 %)'
        },
        market: {
          cap: {
            rur: 3769370874535,
            btc: 7927895
          },
          volume: {
            rur: 1544690000,
            btc: 202340
          },
          supply: 99968544
        }
      }
    }
  },

  computed: {
    wallet () {
      const walletId = this.$route.params.walletId

      return this.$store.getters.wallets.find(w => (w.id === walletId)) || {}
    },

    transactions () {
      if (!this.wallet) return []

      return this.$store.getters.getTransactionsByAssetId(this.wallet.assetId)
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
      this.$store.dispatch('getAccountAssets')
        .then(() => this.$store.dispatch('getAccountAssetTransactions', { assetId: this.wallet.assetId }))
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

.amount {
  font-size: 2rem;
  margin: 0;
  margin-right: 20px;
  font-weight: bold;
  display: block;
}

.top-left-card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-info {
  font-size: 12px;
  line-height: 1.5;
}

.card-info-title {
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.card-info-amount {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.icon {
  width: 17x;
  font-size: 17px;
}
</style>
