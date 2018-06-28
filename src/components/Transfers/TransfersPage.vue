<template>
  <el-container>
    <el-aside class="column-fullheight blue-form-wrapper" width="400px">
      <el-form style="width: 100%">
        <h2 style="margin-bottom: 40px">New Transfer</h2>
        <el-form-item label="I send" prop="amount">
          <el-input name="amount" v-model="transferForm.send_amount" placeholder="0">
            <el-select
              v-model="transferForm.send_asset"
              slot="append"
              placeholder="asset"
              style="width: 100px"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.asset"
                :label="wallet.asset"
                :value="wallet.asset">
                  <span style="float: left">{{ wallet.name + ' (' + wallet.asset + ')' }}</span>
              </el-option>
            </el-select>
          </el-input>
          <span class="form-item-text">
            Available balance:
            <span v-if="transferForm.send_asset" class="form-item-text-amount">
              {{ wallets.filter(x => x.asset === transferForm.send_asset)[0].amount  + ' ' + transferForm.send_asset.toUpperCase() }}
            </span>
            <span v-else>...</span>
          </span>
        </el-form-item>
        <el-form-item label="Counterparty">
          <el-input v-model="transferForm.to" placeholder="Account id" />
        </el-form-item>
        <el-form-item label="Additional information">
          <el-input
            type="textarea"
            :rows="2"
            v-model="transferForm.description"
            placeholder="Account id"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <el-button class="fullwidth black clickable" @click="openApprovalDialog">TRANSFER</el-button>
    </el-aside>
    <el-main>
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
          <el-table-column label="Asset" width="70">
            <template slot-scope="scope">
              ETH
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
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import dateFormat from '@/components/mixins/dateFormat'

export default {
  name: 'transfers-page',
  mixins: [dateFormat],
  data () {
    return {
      transferForm: {
        to: null,
        send_amount: null,
        send_asset: null,
        description: null
      }
    }
  },
  computed: {
    ...mapGetters({
      wallets: 'wallets'
    }),
    // TODO: Fetch all assets later on :D
    transactions () {
      if (!this.wallets) return []

      return this.$store.getters.getTransactionsByAssetId('etherium#test')
    }
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  },
  methods: {
    ...mapActions([
      'openApprovalDialog'
    ])
  }
}
</script>

<style scoped>
</style>
