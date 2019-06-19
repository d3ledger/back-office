<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Fee setting</span>
            </div>
            <el-table
              :data="availableAssets.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%"
            >
              <el-table-column
                label="Name"
                prop="name"
              />
              <el-table-column
                prop="id"
                label="Transfer fee"
              >
                <template slot-scope="scope">
                  {{ transferFee[scope.row.feeId] || 0 }}
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row, FeeTypes.TRANSFER)"
                  >
                    Edit
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Exchange fee"
              >
                <template slot-scope="scope">
                  {{ exchangeFee[scope.row.feeId] || 0 }}
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row, FeeTypes.EXCHANGE)"
                  >
                    Edit
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Withdrawal fee"
              >
                <template slot-scope="scope">
                  {{ withdrawalFee[scope.row.feeId] || 0 }}
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row, FeeTypes.WITHDRAWAL)"
                  >
                    Edit
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Custody fee"
              >
                <template slot-scope="scope">
                  {{ custodyFee[scope.row.feeId] || 0 }}
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row, FeeTypes.CUSTODY)"
                  >
                    Edit
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                align="right"
              >
                <template slot="header">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="Type to search"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      :visible.sync="setFeeFormVisible"
      data-cy="setFeeDialog"
      title="Set fee amount"
      width="450px"
      center
    >
      <el-form class="quorum_form">
        <el-form-item>
          <el-input
            v-model="feeAmount"
            type="number"
            min="0"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-form_buttons-block"
      >
        <el-button
          :loading="settingFee"
          type="danger"
          class="dialog-form_buttons action"
          @click="editFee"
        >
          Set
        </el-button>
        <el-button
          class="dialog-form_buttons close"
          @click="setFeeFormVisible = false"
        >
          Cancel
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import currencySymbol from '@/components/mixins/currencySymbol'
import {
  errorHandler
} from '@/components/mixins/validation'
import { FeeTypes } from '@/data/consts'
// import { required } from 'vuelidate/lib/validators'

export default {
  name: 'ExplorerPage',
  mixins: [
    dateFormat,
    currencySymbol,
    errorHandler
  ],
  data () {
    return {
      search: '',
      setFeeFormVisible: false,
      feeAmount: 0,
      assetToSet: null,
      settingFee: false,
      feeType: '',
      FeeTypes
    }
  },
  computed: {
    ...mapGetters([
      'availableAssets',
      'transferFee',
      'custodyFee',
      'accountCreationFee',
      'exchangeFee',
      'withdrawalFee'
    ])
  },

  beforeMount () {
    console.log(FeeTypes)
    this.getFee(FeeTypes.TRANSFER)
    this.getFee(FeeTypes.CUSTODY)
    this.getFee(FeeTypes.ACCOUNT_CREATION)
    this.getFee(FeeTypes.EXCHANGE)
    this.getFee(FeeTypes.WITHDRAWAL)
  },

  methods: {
    ...mapActions([
      'setFee',
      'getFee',
      'openApprovalDialog'
    ]),

    handleEdit (asset, feeType) {
      this.feeAmount = this.transferFee[asset.feeId] || 0
      this.assetToSet = asset
      this.setFeeFormVisible = true
      this.feeType = feeType
    },

    editFee () {
      this.settingFee = true

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          return this.setFee({
            privateKeys,
            asset: this.assetToSet.feeId,
            fee: this.feeAmount,
            feeType: this.feeType
          })
            .then(() => {
              this.getFee(this.feeType)
              this.$message.success('Fee successfully setted')
            })
            .catch((err) => {
              this.$message.error('Failed to set fee')
              console.error(err)
            })
        })
        .finally(() => {
          this.feeAmount = 0
          this.assetToSet = null
          this.settingFee = false
          this.setFeeFormVisible = false
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
  padding: 1.5rem 1.5rem;
}
</style>
