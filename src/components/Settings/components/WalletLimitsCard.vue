<template>
  <span>
    <el-card
      class="card"
      :body-style="{ padding: '0' }"
    >
      <div class="header_btn">
        <span class="header_btn-title pointed" @click="updateActiveTab(4)">
          <span class="header_btn-icon_block">
            <fa-icon
              class="header_btn-icon"
              :icon="activeTab === 4 ? 'angle-down' : 'angle-right'"
            />
          </span>
          Wallet limits
        </span>
        <el-button class="action_button" data-cy="addWalletLimit" @click="addWalletLimitDialogVisible = true">
          <fa-icon class="action_button-icon" icon="plus" /> Add
        </el-button>
      </div>
      <div v-if="activeTab === 3">
        <div class="settings-item">
          <template v-for="(limit, index) in accountLimits">
            <div
              class="settings-item_row"
              :key="index"
            >
              <span
                class="settings-item_row-key pointed"
                @click="editAssetLimit(limit)"
              >
                {{ limit.wallet.name }} ({{ limit.wallet.asset }})
              </span>
              <span class="settings-item_row-key">
                <span class="settings-item_row-key-item">{{ formatDate(limit.interval_value, limit.interval_type) }} </span>
                <span class="settings-item_row-key-item">{{ limit.amount }} {{ limit.wallet.asset }}</span>
                <el-button
                  class="settings-item_row-delete"
                  @click="removeAssetLimitVisible = true; limitToRemove = limit"
                >
                  <fa-icon icon="trash-alt"/>
                </el-button>
              </span>
            </div>
          </template>
          <div
            class="settings-item_row"
            v-if="!accountLimits.length"
          >
            <span class="settings-item_row-key">You don't have any limits</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      data-cy="addWalletLimit"
      title="Add wallet limit"
      :visible.sync="addWalletLimitDialogVisible"
      :show-close="false"
      @closed="onCloseModal"
      width="450px"
      center
    >
      <div class="approval_form-desc">
        <el-form class="dialog-form" :model="limitForm" ref="limitForm" >
          <el-form-item label="Wallets" prop="assetId">
            <el-select v-model="limitForm.assetId" class="fullwidth">
              <el-option
                v-for="wallet in wallets"
                :key="wallet.name"
                :label="`${wallet.name} (${wallet.asset.toUpperCase()})`"
                :value="wallet.assetId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Time" prop="label">
            <el-select
              placeholder="Select period"
              v-model="limitForm.label"
              class="fullwidth"
            >
              <el-option
                v-for="(timelimit, index) in timelimits"
                :key="index"
                :label="timelimit.label"
                :value="timelimit.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Limit" prop="amount">
            <el-input type="number" v-model="limitForm.amount" placeholder="0"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          class="dialog-form_buttons action"
          @click="onAddAssetLimit"
          :loading="addingNewLimit"
        >
          Create
        </el-button>
        <el-button
          class="dialog-form_buttons close"
          @click="addWalletLimitDialogVisible = false"
        >
          Cancel
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      data-cy="editWalletLimit"
      title="Edit wallet limit"
      :visible.sync="editWalletLimitDialogVisible"
      :show-close="false"
      width="450px"
      center
    >
      <div class="approval_form-desc">
        <el-form class="dialog-form" :model="editLimitForm">
          <el-form-item label="Wallets">
            <el-select v-model="editLimitForm.assetId" class="fullwidth" disabled>
              <el-option
                v-for="wallet in wallets"
                :key="wallet.name"
                :label="`${wallet.name} (${wallet.asset.toUpperCase()})`"
                :value="wallet.assetId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Time">
            <el-select v-model="editLimitForm.label" class="fullwidth">
              <el-option
                v-for="(timelimit, index) in timelimits"
                :key="index"
                :label="timelimit.label"
                :value="timelimit.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Limit">
            <el-input type="number" v-model="editLimitForm.amount" placeholder="0"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          class="dialog-form_buttons action"
          @click="onEditAssetLimit"
          :loading="editingLimit"
        >
          Update
        </el-button>
        <el-button
          class="dialog-form_buttons close"
          @click="editWalletLimitDialogVisible = false"
        >
          Cancel
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      data-cy="removeLimitDialog"
      title="Asset limit"
      :visible.sync="removeAssetLimitVisible"
      width="450px"
      center>
      <div class="approval_form-desc" v-if="limitToRemove.wallet">
        Are you sure want to remove limit for <b>{{ limitToRemove.wallet.name }} ({{ limitToRemove.wallet.asset }})</b> ?
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          @click="onRemoveAssetLimit"
          class="dialog-form_buttons action"
          type="danger"
          :loading="removingLimit">Remove
        </el-button>
        <el-button
          class="dialog-form_buttons close"
          @click="removeAssetLimitVisible = false"
        >
          Cancel
        </el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'wallet-limits-card',
  props: {
    activeTab: {
      type: Number,
      required: true
    },
    updateActiveTab: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      limitToRemove: {},
      timelimits: [{
        amount: 5,
        type: 'M',
        label: '5 Minites'
      }, {
        amount: 30,
        type: 'M',
        label: '30 Minutes'
      }, {
        amount: 1,
        type: 'H',
        label: '1 Hour'
      }, {
        amount: 6,
        type: 'H',
        label: '6 Hours'
      }, {
        amount: 1,
        type: 'D',
        label: '1 Day'
      }],
      addWalletLimitDialogVisible: false,
      editWalletLimitDialogVisible: false,
      removeAssetLimitVisible: false,
      limitForm: {
        assetId: '',
        label: '',
        amount: ''
      },
      editLimitForm: {},
      addingNewLimit: false,
      editingLimit: false,
      removingLimit: false
    }
  },
  computed: {
    ...mapGetters([
      'accountLimits',
      'wallets'
    ])
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'updateAccount',
      'addAssetLimit',
      'removeAssetLimit',
      'getAccountLimits'
    ]),
    onAddAssetLimit () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.addingNewLimit = true
          const timelimit = this.timelimits.find(tl =>
            tl.label === this.limitForm.label
          )
          const { assetId, amount } = this.limitForm
          return this.addAssetLimit({
            privateKeys,
            limit: {
              assetId,
              amount,
              interval_type: timelimit.type,
              interval_value: timelimit.amount
            }
          })
            .then(() => {
              this.$message.success('Limit successfully added')
            })
            .catch((err) => {
              this.$message.error('Failed to add limit')
              console.error(err)
            })
        })
        .finally(() => {
          this.updateActiveTab(3)
          this.getAccountLimits()
          this.addWalletLimitDialogVisible = false
          this.addingNewLimit = false
          this.limitForm = {
            assetId: '',
            label: '',
            amount: ''
          }
        })
    },
    onRemoveAssetLimit (currentLimit) {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.removingLimit = true
          return this.removeAssetLimit({
            privateKeys,
            limit: {
              assetId: this.limitToRemove.assetId
            }
          })
            .then(() => {
              this.$message.success('Limit successfully removed')
            })
            .catch((err) => {
              this.$message.error('Failed to remove limit')
              console.error(err)
            })
        })
        .finally(() => {
          this.updateActiveTab(3)
          this.getAccountLimits()
          this.removingLimit = false
          this.removeAssetLimitVisible = false
        })
    },
    editAssetLimit (currentLimit) {
      this.editWalletLimitDialogVisible = true
      this.editLimitForm = {
        amount: currentLimit.amount,
        assetId: currentLimit.assetId,
        label: this.formatDate(currentLimit.interval_value, currentLimit.interval_type)
      }
    },
    onEditAssetLimit () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.editingLimit = true
          const timelimit = this.timelimits.find(tl =>
            tl.label === this.editLimitForm.label
          )
          const { assetId, amount } = this.editLimitForm
          return this.addAssetLimit({
            privateKeys,
            limit: {
              assetId,
              amount,
              interval_type: timelimit.type,
              interval_value: timelimit.amount
            }
          })
            .then(() => {
              this.$message.success('Limit successfully updated')
            })
            .catch((err) => {
              this.$message.error('Failed to update limit')
              console.error(err)
            })
        })
        .finally(() => {
          this.updateActiveTab(3)
          this.getAccountLimits()
          this.editWalletLimitDialogVisible = false
          this.editingLimit = false
          this.editLimitForm = {}
        })
    },
    onCloseModal () {
      this.$refs.limitForm.resetFields()
    },
    formatDate (value, type) {
      const t = this.timelimits.find(t => t.amount === value && t.type === type)
      return t.label
    }
  }
}
</script>

<style scoped>
.dialog-form >>> .el-input__inner {
  font-weight: 700;
  height: 4.5rem;
  padding-left: 1.2rem;
  padding-top: 1.2rem;
  line-height: 0;
  font-size: 1rem;
  border-radius: 0.1rem;
}
 .dialog-form >>> .el-input__inner:focus {
  opacity: 1;
}
 .dialog-form >>> .el-form-item {
  height: 4.4rem;
}
 .dialog-form >>> .el-form-item__label {
  line-height: 1;
  position: relative;
  top: 1.5rem;
  z-index: 10;
  margin-left: 1.2rem;
  font-size: 0.8rem;
  color: #000000;
}
.dialog-form >>> .el-input__inner {
  height: 4.5rem !important;
}
</style>
