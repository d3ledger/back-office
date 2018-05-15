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
              {{ name }}
            </h1>
          </div>
          <div class="bottom-wrapper">
            <h2 class="amount"> {{ amount + ' ' + asset }}</h2>
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
            <el-table :data="transactions">
              <el-table-column label="Amount" width="100">
                <template slot-scope="scope">
                  {{ (scope.row.from === 'you' ? '- ' : '+ ') + scope.row.amount.toFixed(4)}}
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
              <el-table-column prop="message" label="Message" min-width="200"/>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog
      :title="'Send ' + asset"
      :visible.sync="sendFormVisible"
      width="500px"
    >
      <el-form label-width="4rem">
        <el-form-item label="Transfer:" prop="amount">
          <el-input name="amount" v-model="sendForm.amount">
            <div slot="append">
              {{ asset }}
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="To">
          <el-input v-model="sendForm.to" placeholder="account id or address" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary">Send</el-button>
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
          Scan QR code or send your {{ asset }} to <strong> {{ address }}</strong>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
// TODO: Settlements
import dateFormat from '@/components/mixins/dateFormat'
import mockTransactions from '@/mocks/transactions.json'

export default {
  mixins: [dateFormat],
  data () {
    return {
      name: 'Bitcoin',
      amount: 1.80368522,
      asset: 'BTC',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',

      transactions: mockTransactions,

      receiveFormVisible: false,
      sendFormVisible: false,
      sendForm: {
        to: '',
        amount: 0
      }
    }
  }
}
</script>
<style scoped>
.header {
  background-color: #ffb055;
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
