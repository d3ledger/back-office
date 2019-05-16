<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Fee setting</span>
            </div>
            <el-table
              :data="availableAssets.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">
              <el-table-column
                label="Name"
                prop="name">
              </el-table-column>
              <el-table-column
                prop="id"
                label="Transfer fee">
                <template slot-scope="scope">
                  {{ transferFee[scope.row.feeId] || 0 }}
                </template>
              </el-table-column>
              <el-table-column
                align="right">
                <template slot="header">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="Type to search"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">Edit</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      data-cy="setFeeDialog"
      title="Set fee amount"
      :visible.sync="setFeeFormVisible"
      width="450px"
      center>
      <el-form class="quorum_form">
        <el-form-item>
          <el-input v-model="feeAmount" type="number" min="0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          type="danger"
          @click="setFee"
          class="dialog-form_buttons action"
          :loading="settingFee">
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
// import { required } from 'vuelidate/lib/validators'

export default {
  name: 'explorer-page',
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
      settingFee: false
    }
  },
  computed: {
    ...mapGetters([
      'availableAssets',
      'transferFee'
    ])
  },

  beforeMount () {
    this.getTransferFee()
  },

  methods: {
    ...mapActions([
      'setTransferFee',
      'getTransferFee',
      'openApprovalDialog'
    ]),

    handleEdit (asset) {
      this.feeAmount = this.transferFee[asset.feeId] || 0
      this.assetToSet = asset
      this.setFeeFormVisible = true
    },

    setFee () {
      this.settingFee = true

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          return this.setTransferFee({
            privateKeys,
            asset: this.assetToSet.feeId,
            fee: this.feeAmount
          })
            .then(() => {
              this.getTransferFee()
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
