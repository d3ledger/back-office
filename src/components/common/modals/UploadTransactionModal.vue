<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    :visible="uploadTransactionDialogVisible"
    data-cy="uploadTransactionModal"
    title="Please sign the transaction offline"
    width="450px"
    center
    @close="closeDialog"
  >
    <div>
      For your security, please sign the transaction in D3 OTS app.
    </div>
    <div>
      why are we making you go through hoops?
    </div>
    <div>
      <p>
        <b>Step 1.</b> Switch to desktop
        <a
          href="https://github.com/d3ledger/transaction-signer/releases"
          target="_blank"
        >
          D3 OTS app
        </a>. Turn off internet connection.
      </p>
      <p>
        <b>Step 2.</b> Go to Sign transaction in D3 OTS. Upload transaction draft file (.draft). Upload your private key (.priv). Click “Sign and download” to receive signed transaction file (.bin)
      </p>
      <p>
        <b>Step 3.</b> Turn on internet connection. Switch to D3 web interface. Upload signed transaction file (.bin) <span v-if="uploadTransactionDialogType === true">Step 3. Turn on internet connection. Switch to D3 web interface. Upload signed transaction file (.bin) Confirm the exchange and wait for your counterparty to accept it.</span>
      </p>
    </div>
    <div>
      <upload-tx
        :on-complete="closeDialog"
      />
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  components: {
    UploadTx: lazyComponent('common/UploadTx')
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'uploadTransactionDialogVisible',
      'uploadTransactionDialogType'
    ])
  },
  methods: {
    ...mapActions([
      'closeUploadTransactionDialog'
    ]),
    closeDialog () {
      this.closeUploadTransactionDialog()
    }
  }
}
</script>

<style>

</style>
