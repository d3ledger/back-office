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
                          border
                        >{{ value }}</el-radio>
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
                          border
                        >{{ value }}</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="settings_item-header-title">Notifications</span>
                </div>
                <div>
                  <el-row>
                    <el-col>
                      <el-switch v-model="notifications" @change="switchNotifications">
                      </el-switch>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="settings_item-header-title">Add network</span>
                </div>
                <div>
                  <el-row>
                    <el-col>
                      <el-button
                        v-if="!walletType.includes(WalletTypes.BTC) && freeBtcRelaysNumber > 0"
                        class="action_button content_width"
                        @click="onAddNetwork(WalletTypes.BTC)"
                      >
                        <fa-icon class="action_button-icon" icon="plus" />
                        Register in BTC network
                      </el-button>
                      <div v-else-if="!walletType.includes(WalletTypes.BTC)" class="list-title">
                        There is no free BTC relays now
                      </div>
                      <el-button
                        v-if="!walletType.includes(WalletTypes.ETH) && freeEthRelaysNumber > 0"
                        class="action_button content_width"
                        @click="onAddNetwork(WalletTypes.ETH)"
                      >
                        <fa-icon class="action_button-icon" icon="plus" />
                        Register in ETH network
                      </el-button>
                      <div v-else-if="!walletType.includes(WalletTypes.ETH)" class="list-title">
                        There is no free ETH relays now
                      </div>
                      <span class="list-title" v-if="walletType.length === 2">
                        You already added all networks
                      </span>
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
                        placeholder="Select"
                      >
                        <el-option
                          v-for="(zone, index) in timezones"
                          :key="index"
                          :label="zone"
                          :value="zone"
                        ></el-option>
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
          class="right_column fullheight"
        >
          <el-card
            :body-style="{ padding: '0' }">
            <div class="header_only">
              <span class="header_btn-title">
                Quorum: <b> {{ accountQuorum }} / {{ accountSignatories.length }}</b>
              </span>
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
            :body-style="{ padding: '0' }"
          >
            <div class="header_btn">
              <span class="header_btn-title pointed" @click="updateActiveTab(1)">
                <span class="header_btn-icon_block">
                  <fa-icon
                    class="header_btn-icon"
                    :icon="activeTab === 1 ? 'angle-down' : 'angle-right'"
                  />
                </span>
                Public keys
              </span>
              <el-button class="action_button" data-cy="addPublicKey" @click="addKeyFormVisible = true">
                <fa-icon class="action_button-icon" icon="plus" /> Add
              </el-button>
            </div>
            <div v-if="activeTab === 1">
              <div class="settings-item" data-cy="accountSignatories">
                <template v-for="(pubKey, index) in accountSignatories">
                  <div class="settings-item_row" :key="index">
                    <span @click="() => doCopy(pubKey)" class="settings-item_row-key text-overflow pointed">{{ pubKey }}</span>
                    <el-button
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
            :body-style="{ padding: '0' }"
          >
            <div class="header_btn">
              <span class="header_btn-title pointed" @click="updateActiveTab(2)">
                <span class="header_btn-icon_block">
                  <fa-icon
                    class="header_btn-icon"
                    :icon="activeTab === 2 ? 'angle-down' : 'angle-right'"
                  />
                </span>
                White list
              </span>
            </div>
            <div v-if="activeTab === 2">
              <div class="settings-item">
                <template v-for="(address, index) in withdrawWalletAddresses">
                  <div
                    v-if="withdrawWalletAddresses.length"
                    class="settings-item_row"
                    :key="index">
                    <span class="settings-item_row-key text-overflow">{{ address }}</span>
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
          <WalletLimitsCard :activeTab="activeTab" :updateActiveTab="updateActiveTab" />
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      title="Edit Quorum"
      :visible.sync="quorumFormVisible"
      width="450px"
      center>
      <el-form ref="editQuorumForm" class="quorum_form" :model="quorumForm">
        <el-form-item>
          <el-input-number v-model="quorumForm.amount" :min="1" :max="accountSignatories.length"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          @click="updateQuorum"
          class="dialog-form_buttons action"
          :disabled="quorumForm.amount > accountSignatories.length"
          :loading="quorumUpdating"
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
    <el-dialog
      data-cy="addPublicKeyDialog"
      title="Public key"
      :visible.sync="addKeyFormVisible"
      width="450px"
      center>
      <div class="approval_form-desc">
        Are you sure want to add new public key?
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          type="danger"
          @click="addPublicKey"
          class="dialog-form_buttons action"
          :loading="addingNewKey">Add
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
      data-cy="removePublicKeyDialog"
      title="Public key"
      :visible.sync="removeKeyFormVisible"
      width="450px"
      center>
      <div class="approval_form-desc">
        Are you sure want to remove <b class="key_representation">{{ keyToRemove }}</b> public key?
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          @click="removePublicKey"
          class="dialog-form_buttons action"
          type="danger"
          :loading="removingKey">Remove
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
      data-cy="downloadPrivateKeyDialog"
      title="Private key"
      :visible.sync="downloadKeyVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="450px"
      center>
      <div class="dialog-content">
        <span>Download your private key and keep it secret!</span>
      </div>
      <div slot="footer" class="dialog-form_buttons-block">
        <el-button
          class="dialog-form_buttons action"
          data-cy="buttonDownload"
          @click="onClickDownload"
        >
          <fa-icon icon="download"/>
          Download
        </el-button>
        <el-button
          class="dialog-form_buttons close"
          :disabled="!downloaded"
          data-cy="buttonConfirm"
          @click="downloadKeyVisible = false">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import FileSaver from 'file-saver'
import dateFormat from '@/components/mixins/dateFormat'
import messageMixin from '@/components/mixins/message'
import { mapGetters, mapActions } from 'vuex'
import { WalletTypes } from '@/data/enums'
import { ETH_NOTARY_URL, BTC_NOTARY_URL } from '@/data/urls'
import { lazyComponent } from '@router'
import pushUtil from '@util/push-util'

export default {
  name: 'settings-page',
  components: {
    WalletLimitsCard: lazyComponent('Settings/components/WalletLimitsCard')
  },
  data () {
    return {
      activeTab: 1,
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
      quorumUpdating: false,
      WalletTypes,
      notifications: false
    }
  },
  mixins: [
    dateFormat,
    messageMixin
  ],
  created () {
    this.getSignatories()
    this.getAccountLimits()
    this.getFreeEthRelaysNumber()
    this.getFreeBtcRelaysNumber()

    this.notifications = this.subscribed
  },
  computed: {
    ...mapGetters([
      'settingsFiatCurrencies',
      'settingsCryptoCurrencies',
      'withdrawWalletAddresses',
      'accountQuorum',
      'accountSignatories',
      'walletType',
      'freeEthRelaysNumber',
      'freeBtcRelaysNumber',
      'subscribed'
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
      'getAccountQuorum',
      'setNotaryIp',
      'addNetwork',
      'getAccountLimits',
      'updateAccount',
      'getFreeEthRelaysNumber',
      'getFreeBtcRelaysNumber',
      'subscribePushNotifications',
      'unsubscribePushNotifications'
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
          this.updateActiveTab(1)
          this.addingNewKey = false
          this.addKeyFormVisible = false
          this.getSignatories()
        })
    },
    removePublicKey () {
      if (this.accountSignatories.length <= this.accountQuorum) {
        this.$message.error('Amount of public keys can\'t be smaller than quorum')
        return
      }
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
          this.updateActiveTab(1)
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
      this.$copyText(key)
        .then((e) => this.onCopyKeySuccess(e))
        .catch((e) => this.onCopyKeyError(e))
    },
    onCopyKeySuccess (e) {
      this.$message(`You just copied: ${e.text}`)
    },
    onCopyKeyError (e) {
      this.$message.error('Failed to copy texts')
    },
    onAddNetwork (network) {
      this.openApprovalDialog().then(privateKeys => {
        if (!privateKeys) return

        this.isSending = true
        this.setNotaryIp({ ip: network === WalletTypes.BTC ? BTC_NOTARY_URL : ETH_NOTARY_URL })

        return this.addNetwork({ privateKeys }).then(() => {
          this.$message.success(`You successfuly registered in ${network === WalletTypes.BTC ? 'BTC' : 'ETH'} network!`)
          this.updateAccount()
        }).catch((err) => {
          this.$_showRegistrationError(err.message, err.response)
        })
      })
    },
    updateActiveTab (id) {
      this.activeTab = id
    },
    subscribe (settings) {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.subscribePushNotifications({ privateKeys, settings })
        })
    },
    unsubscribe () {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.unsubscribePushNotifications({ privateKeys })
        })
    },
    switchNotifications (value) {
      if (value) {
        pushUtil.initialiseState(this.subscribe.bind(this))
      } else {
        this.unsubscribe()
      }
    }
  },
  filters: {
    substrKey (key) {
      if (key.length > 57) {
        return key.substr(0, 57) + '...'
      }
      return key
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
  font-weight: 300;
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

.key_representation {
  word-break: break-all;
}

.address_tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.approval_form-desc {
  text-align: center;
}

.quorum_form >>> .el-input-number {
  width: 100%;
}

.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 1rem;
}
</style>

<style>
.card {
  margin-top: 0.5rem;
}
.header_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}
.header_btn-title {
  font-weight: 300;
  height: 2rem;
  line-height: 2rem;
}
.header_btn-icon_block {
  cursor: pointer;
}
.header_btn-icon {
  width: 1rem !important;
  margin-right: 1rem;
  color: #bbbbbb;
}
.header_only {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
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
  border: 1px solid #000000;
  color: #000000;
}
.action_button-icon {
  font-size: 0.7rem;
  height: 0.8rem;
  margin-left: -0.2rem;
  margin-right: 0.3rem;
}
.action_button.content_width {
  width: fit-content
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
.settings-item_row-key-item {
  margin-right: 1rem;
}
.settings-item_row-delete {
  border: none;
  padding: 0;
  height: 0;
  line-height: 3rem;
  font-size: 0.8rem;
}
.settings-item_row-delete:active,
.settings-item_row-delete:focus,
.settings-item_row-delete:hover {
  background-color: #ffffff;
  color: #000000;
}
</style>
