<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    :visible="isVisible"
    data-cy="depositModal"
    title="Please sign the transaction offline"
    width="450px"
    center
    @close="closeSignTransactionDialog()"
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
        <b>Step 3.</b> Turn on internet connection. Switch to D3 web interface. Upload signed transaction file (.bin) <span v-if="transactionType === true">Step 3. Turn on internet connection. Switch to D3 web interface. Upload signed transaction file (.bin) Confirm the exchange and wait for your counterparty to accept it.</span>
      </p>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="completeTransaction()"
      >
        Confirm
      </el-button>
      <el-button @click="closeSignTransactionDialog()">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    transactionType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      transaction: null
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    completeTransaction () {

    },
    closeSignTransactionDialog () {
      this.$emit('update:isVisible', false)
    }
  }
}
</script>

<style>

</style>
