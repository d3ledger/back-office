<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span
        class="header_btn-title pointed"
        @click="updateActiveTab(5)"
      >
        <span class="header_btn-icon_block">
          <fa-icon
            :icon="activeTab === 5 ? 'angle-down' : 'angle-right'"
            class="header_btn-icon"
          />
        </span>
        Send custom transaction
      </span>
    </template>
    <template slot="content">
      <div v-if="activeTab === 5">
        <div
          class="settings-item"
        >
          <el-upload
            ref="galery"
            :multiple="false"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="(f, l) => onTransactionChosen(f, l)"
            :disabled="isTransactionLoading"
            drag
            class="transaction-uploader"
            action=""
            list-type="picture"
            accept=".bin"
          >
            <i class="el-icon-plus image-uploader-icon"/>
            <div class="message">Drop transaction here or <b>click to upload</b></div>
            <div class="message-small">Transaction will be automatically send after validation</div>
          </el-upload>
        </div>
      </div>
    </template>
  </SettingsCard>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'CustomTxCard',
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
    }
  },
  data () {
    return {
      isTransactionLoading: false
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([]),
    onTransactionChosen (file, fileList) {
      const reader = new FileReader()
      let tx

      reader.onload = (ev) => {
        tx = (ev.target.result || '').trim()
        console.log(tx)
      }

      reader.readAsText(file.raw)
    }
  }
}
</script>

<style>
.transaction-uploader {
  width: 100%;
  padding: 1rem;
  color: #000000;
}
.transaction-uploader .el-upload,
.transaction-uploader .el-upload-dragger {
  width: 100%;
  height: 8rem;
}

.transaction-uploader .el-upload-dragger > .el-icon-plus.image-uploader-icon {
  padding: 1.5rem;
}

.message {
  font-size: 0.95rem;
}

.message-small {
  margin-top: 0.25rem;
  font-size: 0.75rem;
}
</style>
