<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span class="header_btn-title">
        Quorum: <b> {{ accountQuorum }} / {{ accountSignatories.length }}</b>
      </span>
      <el-button
        data-cy="editQuorum"
        class="action_button"
        @click="quorumFormVisible = true"
      >
        <fa-icon
          class="action_button-icon"
          icon="pencil-alt"
        /> Edit
      </el-button>
    </template>
    <template slot="content">
      <el-dialog
        :visible.sync="quorumFormVisible"
        title="Edit Quorum"
        width="450px"
        center
      >
        <el-form
          ref="editQuorumForm"
          :model="quorumForm"
          class="quorum_form"
        >
          <el-form-item>
            <el-input-number
              v-model="quorumForm.amount"
              :min="1"
              :max="accountSignatories.length"
              class="fullwidth"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            :disabled="quorumForm.amount > accountSignatories.length"
            :loading="quorumUpdating"
            class="dialog-form_buttons action"
            @click="updateQuorum"
          >
            Update
          </el-button>
          <el-button
            class="dialog-form_buttons close"
            @click="quorumFormVisible = false"
          >
            Cancel
          </el-button>
        </div>
      </el-dialog>
    </template>
  </SettingsCard>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'QuorumCard',
  components: {
    SettingsCard: lazyComponent('Settings/components/Rightside/SettingsCard')
  },
  props: {
    openApprovalDialog: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      quorumFormVisible: false,
      quorumForm: {
        amount: 0
      },
      quorumUpdating: false
    }
  },
  computed: {
    ...mapGetters([
      'accountQuorum',
      'accountSignatories'
    ])
  },
  created () {
    this.getSignatories()
  },
  methods: {
    ...mapActions([
      'getSignatories',
      'editAccountQuorum',
      'getAccountQuorum'
    ]),
    updateQuorum () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.quorumUpdating = true
          return this.editAccountQuorum({
            privateKeys,
            quorum: this.quorumForm.amount
          })
            .then(() => {
              this.$message.success('Quorum successfully updated')
            })
            .catch((err) => {
              this.$message.error('Failed to update quorum')
              console.error(err)
            })
        })
        .finally(() => {
          this.getAccountQuorum()
          this.quorumFormVisible = false
          this.quorumUpdating = false
        })
    }
  }
}
</script>

<style>
</style>
