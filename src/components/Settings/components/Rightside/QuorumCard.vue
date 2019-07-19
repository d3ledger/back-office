<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span class="header_btn-title">
        Quorum: <b>{{ accountQuorum }}</b>
      </span>
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
  computed: {
    ...mapGetters([
      'accountQuorum'
    ])
  },
  created () {
    this.getAccountQuorum()
  },
  methods: {
    ...mapActions([
      'getAccountQuorum'
    ])
  }
}
</script>

<style>
</style>
