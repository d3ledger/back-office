<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    id="approval-dialog"
    :visible="approvalDialogVisible"
    data-cy="confirmModal"
    title="Confirm the transaction"
    width="450px"
    center
    @close="closeApprovalDialogWith()"
  >
    <el-form
      v-show="!isWaitFormVisible"
      ref="approvalForm"
      class="approval_form"
      label-position="top"
      @validate="updateNumberOfValidKeys"
    >
      <el-form-item class="approval_form-item-clearm">
        <el-row class="approval_form-desc">
          <p>
            Please enter your private key<span v-if="accountQuorum > 1">s</span>.
            <span v-if="accountQuorum > 1 && !exchangeDialogVisible">
              You need to enter at least {{ approvalDialogMinAmountKeys }} key.
            </span>
          </p>
          <p v-if="approvalDialogSignatures.length">This transaction already has {{ approvalDialogSignatures.length }} signature<span v-if="approvalDialogSignatures.length > 1">s</span></p>
        </el-row>
      </el-form-item>

      <template v-for="(key, index) in $v.approvalForm.privateKeys.$each.$iter">
        <el-form-item
          :key="index"
          :prop="`privateKeys.${index}.hex`"
          label="Private key"
          class="approval_form-item-clearm"
        >
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col :span="20">
              <el-input
                v-model="key.hex.$model"
                :class="[
                  _isValid($v.approvalForm.privateKeys.$each[index], 'hex') ? 'border_success' : '',
                  _isError($v.approvalForm.privateKeys.$each[index]) ? 'border_fail' : ''
                ]"
                type="password"
                @blur="checkPrivateKey(index)"
                @input="checkPrivateKey(index)"
              />
            </el-col>
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(f, l) => onFileChosen(f, l, key, index)"
              :class="[
                _isValid($v.approvalForm.privateKeys.$each[index], 'hex') ? 'border_success' : '',
                _isError($v.approvalForm.privateKeys.$each[index]) ? 'border_fail' : ''
              ]"
              class="approval_form-upload"
              action=""
            >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
          </el-row>
          <span
            v-if="_isError($v.approvalForm.privateKeys.$each[index])"
            class="el-form-item__error"
          >{{ _showError($v.approvalForm.privateKeys.$each[index].hex) }}</span>
        </el-form-item>
      </template>

      <el-form-item
        v-if="accountQuorum > 1"
        class="approval_form-counter"
      >
        <el-row
          type="flex"
          justify="center"
        >
          <div
            :class="
              approvalForm.numberOfValidKeys + approvalDialogSignatures.length === accountQuorum
                ? 'item__private-keys-success'
                : ''
            "
            class="item__private-keys"
          >
            {{ approvalForm.numberOfValidKeys + approvalDialogSignatures.length }}/{{ accountQuorum }}
          </div>
        </el-row>
        <span
          v-if="$v.approvalForm.privateKeys._keyEqualsTo"
          class="el-form-item__error"
        >One or more keys are not valid</span>
      </el-form-item>
    </el-form>
    <div
      v-show="!isWaitFormVisible"
      slot="footer"
      class="dialog-form_buttons-block"
    >
      <el-button
        id="confirm-approval-form"
        :disabled="disableConfig()"
        class="dialog-form_buttons action"
        @click="beforeSubmitApprovalDialog()"
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
          <circle
            r="50"
            cx="56"
            cy="56"
          />
        </svg>
      </div>
    </span>
    <div
      v-show="isWaitFormVisible"
      slot="footer"
      class="dialog-form_buttons-block"
    >
      <el-button
        :disabled="timeToReject <= 0"
        class="dialog-form_buttons close fullwidth"
        @click="closeApprovalDialogWith()"
      >
        Cancel
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  _keyDuplication,
  _keyPattern,
  _keyEqualsTo,
  errorHandler
} from '@/components/mixins/validation'
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'ConfirmModal',
  mixins: [
    errorHandler
  ],
  validations () {
    return {
      approvalForm: {
        privateKeys: {
          required,
          minLength: minLength(1),
          $each: {
            hex: {
              _keyPattern,
              _keyDuplication: _keyDuplication(this.approvalDialogSignatures),
              _keyEqualsTo: _keyEqualsTo(this.accountSignatories)
            }
          }
        }
      }
    }
  },
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
      'exchangeDialogVisible',
      'approvalDialogVisible',
      'approvalDialogSignatures',
      'approvalDialogMinAmountKeys',
      'accountQuorum',
      'accountSignatories'
    ])
  },
  watch: {
    approvalDialogVisible (isVisible) {
      if (isVisible) this.beforeOpenApprovalDialog()
    }
  },
  methods: {
    ...mapActions([
      'closeApprovalDialog',
      'getSignatories'
    ]),
    closeApprovalDialogWith () {
      clearInterval(this.periodOfFinalisation)
      this.closeApprovalDialog()
      this.resetForm()
      this.isWaitFormVisible = false
      this.periodOfFinalisation = null
      this.timeToReject = 5
    },
    beforeSubmitApprovalDialog () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.isWaitFormVisible = true
      this.periodOfFinalisation = setInterval(() => {
        if (this.timeToReject <= 0) {
          clearInterval(this.periodOfFinalisation)
          this.submitApprovalDialog()
        }
        this.countdown()
      }, 1000)
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
      this.getSignatories()
    },
    onFileChosen (file, fileList, key, index) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        key.hex.$model = (ev.target.result || '').trim()
        this.$v.approvalForm.privateKeys.$each[index].$touch()
        this.updateNumberOfValidKeys()
      }
      reader.readAsText(file.raw)
    },
    checkPrivateKey (index) {
      this.$v.approvalForm.privateKeys.$each[index].$touch()
      this.updateNumberOfValidKeys()
    },
    updateNumberOfValidKeys () {
      const privateKeysFields = this.$v.approvalForm.privateKeys.$each.$iter
      let tempNumberOfValidKeys = 0
      for (const field in privateKeysFields) {
        if (this._isValid(privateKeysFields[field], 'hex')) {
          tempNumberOfValidKeys += 1
        }
      }
      this.$set(this.approvalForm, 'numberOfValidKeys', tempNumberOfValidKeys)
    },
    disableConfig () {
      if (this.exchangeDialogVisible) {
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.accountQuorum)
      } else {
        if (this.approvalDialogMinAmountKeys === 1) {
          return this.approvalForm.numberOfValidKeys < 1
        }
        return !(this.approvalForm.numberOfValidKeys + this.approvalDialogSignatures.length === this.approvalDialogMinAmountKeys)
      }
    },
    resetForm () {
      this.$v.approvalForm.$reset()
      this.approvalForm = {
        privateKeys: [],
        numberOfValidKeys: 0
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
