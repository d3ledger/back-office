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
          <el-form
            ref="form"
            v-model="form"
            class="approval_form"
            label-position="top"
          >
            <el-form-item
              label="Public key"
              class="approval_form-item-clearm"
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col :span="20">
                  <el-input
                    v-model="$v.form.keyToAdd.$model"
                    :class="[
                      _isValid($v.form.keyToAdd) ? 'border_success' : '',
                      _isError($v.form.keyToAdd) ? 'border_fail' : ''
                    ]"
                    type="password"
                  />
                </el-col>
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="(f, l) => onFileChosen(f, l)"
                  :class="[
                    _isValid($v.form.keyToAdd) ? 'border_success' : '',
                    _isError($v.form.keyToAdd) ? 'border_fail' : ''
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
                v-if="_isError($v.form.keyToAdd)"
                class="el-form-item__error"
              >{{ _showError($v.form.keyToAdd) }}</span>
            </el-form-item>
          </el-form>
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
    </template>
  </SettingsCard>
</template>

<script>
import FileSaver from 'file-saver'
import { mapActions, mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import { required } from 'vuelidate/lib/validators'
import {
  _keyPattern,
  errorHandler
} from '@/components/mixins/validation'

export default {
  name: 'PublicKeysCard',
  components: {
    SettingsCard: lazyComponent('Settings/components/Rightside/SettingsCard')
  },
  mixins: [
    errorHandler
  ],
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
  validations: {
    form: {
      keyToAdd: {
        required,
        _keyPattern
      }
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
      form: {
        keyToAdd: ''
      }
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
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.createAddSignatoryTransaction(this.form.keyToAdd)
      this.form.keyToAdd = ''
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
    onFileChosen (file, fileList) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        this.form.keyToAdd = (ev.target.result || '').trim()
        console.log(this.form.keyToAdd)
        this.$v.$touch()
      }
      reader.readAsText(file.raw)
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
