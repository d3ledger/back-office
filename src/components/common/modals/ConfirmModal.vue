<template>
  <el-dialog
    id="approval-dialog"
    title="Confirm the transaction"
    width="450px"
    :visible="approvalDialogVisible"
    @close="closeApprovalDialogWith()"
    center
  >
    <el-form
      ref="approvalForm"
      :model="approvalForm"
      class="approval_form"
      label-position="top"
      @validate="updateNumberOfValidKeys"
      v-show="!isWaitFormVisible"
    >
      <el-form-item class="approval_form-item-clearm">
        <el-row class="approval_form-desc">
          <p>
            Please enter your private key<span v-if="accountQuorum > 1">s</span>.
            <span v-if="accountQuorum > 1 && !isExchangeDialogVisible">
              You need to enter at least {{ approvalDialogMinAmountKeys }} key.
            </span>
          </p>
          <p v-if="approvalDialogSignatures.length">This transaction already has {{approvalDialogSignatures.length}} signature<span v-if="approvalDialogSignatures.length > 1">s</span></p>
        </el-row>
      </el-form-item>

      <el-form-item
        label="Private key"
        v-for="(key, index) in approvalForm.privateKeys"
        :key="index"
        :prop="`privateKeys.${index}.hex`"
        :rules="rules.repeatingPrivateKey"
        class="approval_form-item-clearm"
      >
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <el-input
              v-model="key.hex"
              :class="{ 'is-empty': !key.hex }"
            />
          </el-col>

          <el-upload
            class="approval_form-upload"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(f, l) => onFileChosen(f, l, key)"
          >
            <el-button>
              <fa-icon icon="upload" />
            </el-button>
          </el-upload>
        </el-row>
      </el-form-item>

      <el-form-item
        class="approval_form-counter"
        v-if="accountQuorum > 1"
      >
        <el-row type="flex" justify="center">
          <div class="item__private-keys" :class="approvalForm.numberOfValidKeys + approvalDialogSignatures.length === accountQuorum ? 'item__private-keys-success' :''">
            {{ approvalForm.numberOfValidKeys + approvalDialogSignatures.length }}/{{ accountQuorum }}
          </div>
        </el-row>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-form_buttons-block"
      v-show="!isWaitFormVisible"
    >
      <el-button
        id="confirm-approval-form"
        class="dialog-form_buttons action"
        @click="beforeSubmitApprovalDialog()"
        :disabled="disableConfig()"
      >
        Confirm
      </el-button>
      <el-button
        class="dialog-form_buttons close"
        @click="closeApprovalDialogWith()"
      >
        Cancel
      </el-button>
    </div>
    <span v-show="isWaitFormVisible">
      <div class="form-countdown">
        <div class="form-countdown-number">
          {{ timeToReject }}
        </div>
        <svg>
          <circle r="50" cx="56" cy="56"></circle>
        </svg>
      </div>
    </span>
    <div
      slot="footer"
      class="dialog-form_buttons-block"
      v-show="isWaitFormVisible"
    >
      <el-button
        class="dialog-form_buttons close fullwidth"
        @click="closeApprovalDialogWith()"
        :disabled="timeToReject <= 0"
      >
        Cancel
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import inputValidation from '@/components/mixins/inputValidation'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'confirm-modal',
  props: {
    isExchangeDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  mixins: [
    inputValidation({
      privateKey: 'repeatingPrivateKey'
    })
  ],
  data () {
    return {
      approvalForm: {
        privateKeys: [],
        numberOfValidKeys: 0
      },
      timeToReject: 5,
      isWaitFormVisible: false,
      periodOfFinalisation: null
    }
  },
  computed: {
    ...mapGetters([
      'approvalDialogVisible',
      'approvalDialogSignatures',
      'approvalDialogMinAmountKeys',
      'accountQuorum'
    ])
  },
  watch: {
    approvalDialogVisible (isVisible) {
      if (isVisible) this.beforeOpenApprovalDialog()
    }
  },
  methods: {
    ...mapActions([
      'closeApprovalDialog'
    ]),
    insertPrivateKey (key, i) {
      this.$set(this.approvalForm.privateKeys, i, key)
    },
    closeApprovalDialogWith () {
      clearInterval(this.periodOfFinalisation)
      this.closeApprovalDialog()
      this.$refs.approvalForm.resetFields()
      this.$refs.approvalForm.clearValidate()
      this.isWaitFormVisible = false
      this.periodOfFinalisation = null
      this.timeToReject = 5
    },
    beforeSubmitApprovalDialog () {
      this.$refs.approvalForm.validate(valid => {
        if (!valid) return
        this.isWaitFormVisible = true
        this.periodOfFinalisation = setInterval(() => {
          if (this.timeToReject <= 0) {
            clearInterval(this.periodOfFinalisation)
            this.submitApprovalDialog()
          }
          this.countdown()
        }, 1000)
      })
    },
    countdown () {
      this.timeToReject = this.timeToReject - 1
    },
    submitApprovalDialog () {
      this.closeApprovalDialog(this.approvalForm.privateKeys.map(x => x.hex).filter(x => !!x))
        .finally(() => {
          this.closeApprovalDialogWith()
        })
    },
    beforeOpenApprovalDialog () {
      const privateKeys = Array.from({ length: this.accountQuorum - this.approvalDialogSignatures.length }, () => ({ hex: '' }))
      this.$set(this.approvalForm, 'privateKeys', privateKeys)
      this.updateNumberOfValidKeys()

      this._refreshRules({
        repeatingPrivateKey: { pattern: 'repeatingPrivateKey', keys: this.approvalDialogSignatures }
      })
    },
    onFileChosen (file, fileList, key) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        key.hex = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
    },
    updateNumberOfValidKeys () {
      if (!this.$refs.approvalForm) return

      this.approvalForm.numberOfValidKeys = this.$refs.approvalForm.fields.filter(x => {
        return x.validateState === 'success' && !!x.fieldValue
      }).length
    },
    disableConfig () {
      if (this.isExchangeDialogVisible) {
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.accountQuorum)
      } else {
        if (this.approvalDialogMinAmountKeys === 1) {
          return this.approvalForm.numberOfValidKeys < 1
        }
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.approvalDialogMinAmountKeys)
      }
    }
  }
}
</script>

<style scoped>
.form-countdown {
  position: relative;
  margin: auto;
  font-weight: 300;
  height: 7rem;
  width: 7rem;
  text-align: center;
}

.form-countdown-number {
  color: black;
  display: inline-block;
  line-height: 7rem;
  font-size: 2rem;
}

.form-countdown svg {
  position: absolute;
  top: 0;
  right: 0;
  width: 7rem;
  height: 7rem;
  transform: rotateY(-180deg) rotateZ(-90deg);
}

.form-countdown svg circle {
  stroke-dasharray: 315px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 1px;
  stroke: black;
  fill: none;
  animation: countdown 5s linear 1;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 315px;
  }
}
</style>
