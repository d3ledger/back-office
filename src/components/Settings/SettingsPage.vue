<template>
  <el-container class="fullheight">
    <el-main class="fullheight">
      <el-row class="fullheight">
        <el-col
          :xs="12"
          :lg="{ span: 9, offset: 3 }"
          :xl="{ span: 8, offset: 4 }"
          class="left_column fullheight">
          <el-card
            :body-style="{ padding: '0' }" class="fullheight">
            <div class="header">
              <span>Settings</span>
            </div>
            <div class="settings">
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="settings_item-header-title">Currency</span>
                </div>
                <div>
                  <el-row class="currencies_list">
                    <p class="list-title">Dashboard (Portfolio, Market, Balance and Changes)</p>
                    <el-col>
                      <el-radio-group v-model="currentFiat" size="small">
                        <el-radio
                          v-for="(value, index) in settingsFiatCurrencies"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border>{{ value }}</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                  <el-row class="currencies_list">
                    <p class="list-title">Wallets (Market)</p>
                    <el-col>
                      <el-radio-group v-model="currentCrypto" size="small">
                        <el-radio
                          v-for="(value, index) in settingsCryptoCurrencies"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border>{{ value }}</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="settings_item-header-title">Time zone</span>
                </div>
                <div>
                  <el-row>
                    <el-col>
                      <el-select
                        id="timezone_select"
                        class="full-width_select"
                        v-model="currentZone"
                        filterable
                        placeholder="Select">
                        <el-option
                          v-for="(zone, index) in timezones"
                          :key="index"
                          :label="zone"
                          :value="zone">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col
          :xs="12"
          :lg="{ span: 9 }"
          :xl="{ span: 8 }"
          class="right_column fullheight">
          <el-card
            :body-style="{ padding: '0' }">
            <div class="header_btn">
              <span>Public keys</span>
              <el-button class="action_button" data-cy="addPublicKey" @click="addKeyFormVisible = true">
                <fa-icon class="action_button-icon" icon="plus" /> Add
              </el-button>
            </div>
            <div>
              <div class="settings-item" data-cy="accountSignatories">
                <template v-for="(pubKey, index) in accountSignatories">
                  <div class="settings-item_row" :key="index">
                    <span @click="() => doCopy(pubKey)" class="settings-item_row-key pointed">{{ pubKey | substrKey}}</span>
                    <el-button
                      v-if="accountSignatories.length != accountQuorum"
                      data-cy="removeSignatory"
                      class="settings-item_row-delete"
                      @click="removeKeyFormVisible = true; keyToRemove = pubKey">
                      <fa-icon icon="trash-alt"/>
                    </el-button>
                  </div>
                </template>
              </div>
            </div>
          </el-card>
          <el-card
            class="card"
            :body-style="{ padding: '0' }">
            <div class="header_only">
              <span>Quorum: <b> {{ accountQuorum }} / {{ accountSignatories.length }}</b></span>
              <el-button
                data-cy="editQuorum"
                class="action_button"
                @click="quorumFormVisible = true">
                <fa-icon class="action_button-icon" icon="pencil-alt" /> Edit
              </el-button>
            </div>
          </el-card>
          <el-card
            class="card"
            :body-style="{ padding: '0' }">
            <div class="header_btn">
              <span>White list</span>
            </div>
            <div>
              <div class="settings-item">
                <template v-for="(address, index) in withdrawWalletAddresses">
                  <div
                    v-if="withdrawWalletAddresses.length"
                    class="settings-item_row"
                    :key="index">
                    <span class="settings-item_row-key">{{ address }}</span>
                  </div>
                </template>
                <div
                  v-if="!withdrawWalletAddresses.length"
                  class="settings-item_row">
                  <span class="settings-item_row-key">You can withdraw to any address</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      title="Edit Quorum"
      :visible.sync="quorumFormVisible"
      width="500px"
      center>
      <el-form ref="editQuorumForm" class="quorum_form" :model="quorumForm">
        <el-form-item>
          <el-input-number v-model="quorumForm.amount" :min="1" :max="accountSignatories.length"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button
            @click="updateQuorum"
            class="fullwidth black clickable"
            :disabled="quorumForm.amount > accountSignatories.length"
            :loading="quorumUpdating">
            Update
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      data-cy="addPublicKeyDialog"
      title="Public key"
      :visible.sync="addKeyFormVisible"
      width="500px"
      center>
      <div class="approval_form-desc">
        Are you sure want to add new public key?
      </div>
      <div slot="footer">
        <el-button
          type="danger"
          @click="addPublicKey"
          class="fullwidth black clickable"
          :loading="addingNewKey">Add
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      data-cy="removePublicKeyDialog"
      title="Public key"
      :visible.sync="removeKeyFormVisible"
      width="500px"
      center>
      <div class="approval_form-desc">
        Are you sure want to remove <b>{{ keyToRemove }}</b> public key?
      </div>
      <div slot="footer">
        <el-button
          @click="removePublicKey"
          class="fullwidth"
          type="danger"
          :loading="removingKey">Remove
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      data-cy="downloadPrivateKeyDialog"
      title="Private key"
      :visible.sync="downloadKeyVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="500px"
      center>
      <div class="dialog-content">
        <span>Download your private key and keep it secret!</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="black"
          data-cy="buttonDownload"
          @click="onClickDownload"
        >
          <fa-icon icon="download"/>
          Download
        </el-button>

        <el-button
          type="default"
          :disabled="!downloaded"
          data-cy="buttonConfirm"
          @click="downloadKeyVisible = false">
          Confirm
        </el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import FileSaver from 'file-saver'
import dateFormat from '@/components/mixins/dateFormat'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'settings-page',
  data () {
    return {
      quorumFormVisible: false,
      addKeyFormVisible: false,
      removeKeyFormVisible: false,
      downloadKeyVisible: false,
      quorumForm: {
        amount: 0
      },
      fileData: null,
      downloaded: false,
      addingNewKey: false,
      keyToRemove: null,
      removingKey: false,
      quorumUpdating: false
    }
  },
  mixins: [
    dateFormat
  ],
  created () {
    this.getSignatories()
  },
  computed: {
    ...mapGetters([
      'settingsFiatCurrencies',
      'settingsCryptoCurrencies',
      'withdrawWalletAddresses',
      'accountQuorum',
      'accountSignatories'
    ]),
    currentFiat: {
      get () {
        return this.$store.getters.settingsView.fiat
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewFiat', value)
      }
    },
    currentCrypto: {
      get () {
        return this.$store.getters.settingsView.crypto
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewCrypto', value)
      }
    },
    currentZone: {
      get () {
        return this.$store.getters.settingsView.timezone
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewTime', value)
      }
    }
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'getSignatories',
      'addSignatory',
      'removeSignatory',
      'editAccountQuorum',
      'getAccountQuorum'
    ]),
    addPublicKey () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.addingNewKey = true
          return this.addSignatory(privateKeys)
            .then((fileData) => {
              this.fileData = fileData
              this.downloaded = false
              this.downloadKeyVisible = true
            })
            .catch(err => {
              this.$message.error('Failed to add new public key')
              console.error(err)
            })
        })
        .finally(() => {
          this.addingNewKey = false
          this.addKeyFormVisible = false
          this.getSignatories()
        })
    },
    removePublicKey () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return
          this.removingKey = true
          return this.removeSignatory({
            privateKeys,
            publicKey: this.keyToRemove
          })
            .then((fileData) => {
              this.$message.success('Public key is removed')
            })
            .catch(err => {
              this.$message.error('Failed to remove public key')
              console.error(err)
            })
        })
        .finally(() => {
          this.removingKey = false
          this.removeKeyFormVisible = false
          this.getSignatories()
        })
    },
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
    },
    onClickDownload () {
      const filename = `${this.fileData.username}.priv`
      const blob = new Blob(
        [this.fileData.privateKey],
        { type: 'text/plain;charset=utf-8' }
      )

      if (window.Cypress) {
        this.downloaded = true
        this.fileData = null
        return filename
      }

      FileSaver.saveAs(blob, filename)

      this.downloaded = true
      this.fileData = null
    },
    doCopy (key) {
      const hexKey = Buffer.from(key, 'base64').toString('hex')
      this.$copyText(hexKey)
        .then((e) => this.onCopyKeySuccess(e))
        .catch((e) => this.onCopyKeyError(e))
    },
    onCopyKeySuccess (e) {
      this.$message(`You just copied: ${e.text}`)
    },
    onCopyKeyError (e) {
      this.$message.error('Failed to copy texts')
    }
  },
  filters: {
    substrKey (key) {
      const hexKey = Buffer.from(key, 'base64').toString('hex')
      if (hexKey.length > 57) {
        return hexKey.substr(0, 57) + '...'
      }
      return hexKey
    }
  }
}
</script>

<style scoped>
.right_column {
  margin-left: 0.5rem;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.5rem 1.5rem;
}

.header_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.header_only {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.card {
  margin-top: 0.5rem;
}

.settings {
  padding: 0 1.5rem;
}

.settings_item {
  margin-bottom: 20px;
}

.row_sub-header {
  margin-bottom: 10px;
}

.row_sub-header > .header_small {
  font-size: 0.8rem;
}

.settings_item-header {
  margin-bottom: 15px;
}

.settings_item-header-title {
  font-size: 1rem;
}

.currencies_list {
  margin-bottom: 10px;
}

.list-title {
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.currencies_list-select {
  width: 5rem;
  height: 2.5rem;
  font-size: 1.1rem;
}

.full-width_select {
  width: 100%;
}

.address_list {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 5px 0 5px;
  width: 100%;
}

.address_tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.settings-item {
  max-height: 20rem;
  overflow-y: scroll;
}

.settings-item_row {
  padding: 0 1.5rem;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #efefef;
}
.settings-item_row:hover {
  background-color: #f7f7f7;
}

.settings-item_row-key {
  font-size: 0.8rem;
  line-height: 3rem;
}

.settings-item_row-key.pointed {
  cursor: pointer;
}

.settings-item_row-delete {
  border: none;
  padding: 0;
  height: 0;
  line-height: 3rem;
}

.settings-item_row-delete:active,
.settings-item_row-delete:focus,
.settings-item_row-delete:hover {
  background-color: #ffffff;
  color: #000000;
}

.action_button {
  border: 1px solid #000000;
  text-transform: uppercase;
  width: 5rem;
  padding: 0.5rem;
}

.action_button:active,
.action_button:focus,
.action_button:hover {
  background-color: #ffffff;
  color: #000000;
}

.action_button-icon {
  font-size: 0.7rem;
  height: 0.8rem;
  margin-left: -0.2rem;
  margin-right: 0.3rem;
}

.approval_form-desc {
  text-align: center;
}

.quorum_form >>> .el-input-number {
  width: 100%;
}
</style>
