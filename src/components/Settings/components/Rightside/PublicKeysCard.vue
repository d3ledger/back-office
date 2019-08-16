<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span
        class="header_btn-title pointed"
        @click="updateActiveTab(1)"
      >
        <span class="header_btn-icon_block">
          <fa-icon
            :icon="activeTab === 1 ? 'angle-down' : 'angle-right'"
            class="header_btn-icon"
          />
        </span>
        Public keys
      </span>
      <el-button
        class="action_button"
        data-cy="addPublicKey"
        @click="addKeyFormVisible = true"
      >
        <fa-icon
          class="action_button-icon"
          icon="plus"
        /> Add
      </el-button>
    </template>
    <template slot="content">
      <div v-if="activeTab === 1">
        <div
          class="settings-item"
          data-cy="accountSignatories"
        >
          <template v-for="(pubKey, index) in accountSignatories">
            <div
              :key="index"
              class="settings-item_row"
            >
              <span
                class="settings-item_row-key text-overflow pointed"
                @click="() => doCopy(pubKey)"
              >{{ pubKey }}</span>
              <el-button
                v-show="accountSignatories.length !== 1"
                data-cy="removeSignatory"
                class="settings-item_row-delete"
                @click="removeKeyFormVisible = true; keyToRemove = pubKey"
              >
                <fa-icon icon="trash-alt"/>
              </el-button>
            </div>
          </template>
        </div>
      </div>
      <el-dialog
        :visible.sync="addKeyFormVisible"
        data-cy="addPublicKeyDialog"
        title="Public key"
        width="450px"
        center
      >
        <div class="approval_form-desc">
          Enter public key to add
        </div>
        <div class="approval_form-desc">
          <el-input
            v-model="keyToAdd"
          />
        </div>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            :loading="addingNewKey"
            type="danger"
            class="dialog-form_buttons action"
            @click="addPublicKey"
          >Add
          </el-button>
          <el-button
            class="dialog-form_buttons close"
            @click="addKeyFormVisible = false"
          >
            Cancel
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="removeKeyFormVisible"
        data-cy="removePublicKeyDialog"
        title="Public key"
        width="450px"
        center
      >
        <div class="approval_form-desc">
          Are you sure want to remove <b class="key_representation">{{ keyToRemove }}</b> public key?
        </div>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            :loading="removingKey"
            class="dialog-form_buttons action"
            type="danger"
            @click="removePublicKey"
          >Remove
          </el-button>
          <el-button
            class="dialog-form_buttons close"
            @click="removeKeyFormVisible = false"
          >
            Cancel
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="downloadKeyVisible"
        :close-on-click-modal="false"
        :show-close="false"
        data-cy="downloadPrivateKeyDialog"
        title="Private key"
        width="450px"
        center
      >
        <div class="approval_form-desc">
          <span>Download your private key and keep it secret!</span>
        </div>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            class="dialog-form_buttons action"
            data-cy="buttonDownload"
            @click="onClickDownload"
          >
            <fa-icon icon="download"/>
            Download
          </el-button>
          <el-button
            :disabled="!isDownloaded"
            class="dialog-form_buttons close"
            data-cy="buttonConfirm"
            @click="downloadKeyVisible = false"
          >
            Confirm
          </el-button>
        </div>
      </el-dialog>
    </template>
  </SettingsCard>
</template>

<script>
import FileSaver from 'file-saver'

import { mapActions, mapGetters } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'PublicKeysCard',
  components: {
    SettingsCard: lazyComponent('Settings/components/Rightside/SettingsCard')
  },

  props: {
    activeTab: {
      type: Number,
      required: true
    },
    updateActiveTab: {
      type: Function,
      required: true
    },
    openApprovalDialog: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      addKeyFormVisible: false,
      removeKeyFormVisible: false,
      downloadKeyVisible: false,
      fileData: null,
      isDownloaded: false,
      addingNewKey: false,
      keyToRemove: null,
      removingKey: false,
      keyToAdd: ''
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
      'addSignatory',
      'removeSignatory',
      'getSignatories',
      'createAddSignatoryTransaction',
      'createRemoveSignatoryTransaction'
    ]),
    addPublicKey () {
      this.createAddSignatoryTransaction(this.keyToAdd)
      this.keyToAdd = ''
      this.updateActiveTab(1)
      this.addingNewKey = false
      this.addKeyFormVisible = false
    },
    removePublicKey () {
      if (this.accountSignatories.length === 1) {
        this.$message.error('Amount of public keys can\'t be smaller than quorum')
        return
      }

      this.createRemoveSignatoryTransaction(this.keyToRemove)
      this.updateActiveTab(1)
      this.removingKey = false
      this.removeKeyFormVisible = false
    },
    doCopy (key) {
      const onSuccess = (e) => this.$message(`You just copied: ${e.text}`)
      const onError = (e) => this.$message.error('Failed to copy public key')
      this.$copyText(key)
        .then(onSuccess)
        .catch(onError)
    },
    onClickDownload () {
      const filename = `${this.fileData.username}.priv`
      const blob = new Blob(
        [this.fileData.privateKey],
        { type: 'text/plain;charset=utf-8' }
      )

      if (window.Cypress) {
        this.isDownloaded = true
        this.fileData = null
        return filename
      }

      FileSaver.saveAs(blob, filename)

      this.isDownloaded = true
      this.fileData = null
    }
  }
}
</script>

<style>

</style>
