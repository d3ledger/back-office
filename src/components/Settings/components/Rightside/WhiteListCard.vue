<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span
        class="header_btn-title pointed"
        @click="updateActiveTab(id)"
      >
        <span class="header_btn-icon_block">
          <fa-icon
            :icon="activeTab === id ? 'angle-down' : 'angle-right'"
            class="header_btn-icon"
          />
        </span>
        {{ walletTitle }} white list
      </span>
      <el-button
        class="action_button"
        data-cy="addEthWhiteAddress"
        @click="addAddressFormVisible = true"
      >
        <fa-icon
          class="action_button-icon"
          icon="plus"
        /> Add
      </el-button>
    </template>
    <template slot="content">
      <div v-if="activeTab === id">
        <div class="settings-item">
          <template v-for="(address, index) in whiteListAddressesAll">
            <div
              v-if="whiteListAddressesAll.length"
              :key="index"
              class="settings-item_row"
            >
              <span class="settings-item_row-key text-overflow">{{ address[0] }}</span>
              <div>
                <el-tooltip
                  :content="`Pending until ${formatDate(address[1] * 1000)}`"
                  class="item"
                  effect="dark"
                  placement="top"
                >
                  <el-tag
                    v-if="address[1] * 1000 > Date.now()"
                    class="pending"
                    type="info"
                  >Pending</el-tag>
                </el-tooltip>
                <el-button
                  data-cy="removeAddress"
                  class="settings-item_row-delete"
                  @click="removeAddressFormVisible = true; addressToRemove = address[0]"
                >
                  <fa-icon icon="trash-alt"/>
                </el-button>
              </div>
            </div>
          </template>
          <div
            v-if="!whiteListAddressesAll.length"
            class="settings-item_row"
          >
            <span class="settings-item_row-key">You can withdraw to any address</span>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="addAddressFormVisible"
        data-cy="addWhiteAddressDialog"
        title="Add new white address"
        width="450px"
        center
        @closed="onCloseWhiteAddressForm"
      >
        <div class="approval_form-desc">
          <el-form
            ref="newWhiteAddressForm"
            :model="whitelistForm"
            class="dialog-form"
          >
            <el-form-item
              label="Address"
              prop="address"
            >
              <el-input
                v-model="$v.whitelistForm.address.$model"
                :class="[
                  _isValid($v.whitelistForm.address) ? 'border_success' : '',
                  _isError($v.whitelistForm.address) ? 'border_fail' : ''
                ]"
              />
              <span
                v-if="_isError($v.whitelistForm.address)"
                class="el-form-item__error"
              >{{ _showError($v.whitelistForm.address) }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            :loading="addingNewAddress"
            class="dialog-form_buttons action"
            @click="addWhiteAddress"
          >Add
          </el-button>
          <el-button
            class="dialog-form_buttons close"
            @click="addAddressFormVisible = false"
          >
            Cancel
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="removeAddressFormVisible"
        data-cy="removeAddressForm"
        title="Remove white address"
        width="450px"
        center
      >
        <div class="approval_form-desc">
          Are you sure want to remove <b class="key_representation">{{ addressToRemove }}</b> address from whitelist?
        </div>
        <div
          slot="footer"
          class="dialog-form_buttons-block"
        >
          <el-button
            :loading="removingAddress"
            class="dialog-form_buttons action"
            @click="removeWhiteAddress"
          >Remove
          </el-button>
          <el-button
            class="dialog-form_buttons close"
            @click="removeAddressFormVisible = false"
          >
            Cancel
          </el-button>
        </div>
      </el-dialog>
    </template>
  </SettingsCard>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

import { WalletTypes } from '@/data/consts'

import { _wallet, errorHandler } from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'

const ETHEREUM_TITLE = 'Ethereum'
const BITCOIN_TITLE = 'Bitcoin'

export default {
  name: 'WhiteListCard',
  components: {
    SettingsCard: lazyComponent('Settings/components/Rightside/SettingsCard')
  },
  mixins: [
    dateFormat,
    errorHandler
  ],
  props: {
    id: {
      type: Number,
      required: true
    },
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
    },
    walletType: {
      type: Symbol,
      required: true
    }
  },
  validations () {
    return {
      whitelistForm: {
        address: {
          required,
          [`_${this.validationType}`]: _wallet[this.validationType]
        }
      }
    }
  },
  data () {
    return {
      WalletTypes,

      walletTitle: '',

      addAddressFormVisible: false,
      addingNewAddress: false,

      removeAddressFormVisible: false,
      removingAddress: false,

      addressToRemove: null,
      whitelistForm: {
        address: ''
      },
      whiteListAddressesAll: []
    }
  },
  computed: {
    ...mapGetters([
      'accountQuorum',
      'ethWhiteListAddressesAll',
      'btcWhiteListAddressesAll'
    ]),
    validationType () {
      const address = 'Address'
      if (this.walletTitle === ETHEREUM_TITLE) {
        return `eth${address}`
      }
      return `btc${address}`
    }
  },
  created () {
    this.setupWhiteListCard()
  },
  beforeUpdate () {
    this.setupWhiteListCard()
  },
  methods: {
    ...mapActions([
      'setWhiteList',
      'createSetWhiteListTransaction',
      'openUploadTransactionDialog'
    ]),
    addWhiteAddress () {
      this.$v.whitelistForm.$touch()
      if (this.$v.whitelistForm.$invalid) return

      const oldAddresses = this.whiteListAddressesAll
        .map(item => item[0])

      if (oldAddresses.includes(this.whitelistForm.address)) {
        this.$message.error(
          `This address already in ${this.walletTitle.toLowerCase()} white list`
        )
        return
      }

      const whitelist = [
        ...oldAddresses,
        this.whitelistForm.address
      ]

      this.createSetWhiteListTransaction({
        whitelist,
        type: this.walletType
      })

      this.addAddressFormVisible = false
      this.addingNewAddress = false
      this.whitelistForm = {
        address: ''
      }

      this.openUploadTransactionDialog()
    },
    removeWhiteAddress () {
      const whitelist = [
        ...this.whiteListAddressesAll
          .filter(item => item[0] !== this.addressToRemove)
          .map(item => item[0])
      ]

      this.createSetWhiteListTransaction({
        whitelist,
        type: this.walletType
      })

      this.removeAddressFormVisible = false
      this.removingAddress = false
      this.addressToRemove = null

      this.openUploadTransactionDialog()
    },

    onCloseWhiteAddressForm () {
      if (this.$refs.newWhiteAddressForm) {
        this.$v.$reset()
        this.$refs.newWhiteAddressForm.resetFields()
      }
    },

    setupWhiteListCard () {
      if (this.walletType === this.WalletTypes.ETH) {
        this.walletTitle = ETHEREUM_TITLE
        this.whiteListAddressesAll = this.ethWhiteListAddressesAll
      } else {
        this.walletTitle = BITCOIN_TITLE
        this.whiteListAddressesAll = this.btcWhiteListAddressesAll
      }
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
