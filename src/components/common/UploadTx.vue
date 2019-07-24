<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-upload
    ref="galery"
    :multiple="false"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="(f, l) => onTransactionChosen(f, l)"
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
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UploadTx',
  props: {
    onComplete: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions([
      'sendCustomTransaction'
    ]),
    onTransactionChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        const bytes = ev.target.result || []
        this.sendCustomTransaction(
          new Uint8Array(bytes)
        )
          .then(() => {
            this.$message.success('Transaction sended!')
            this.onComplete()
          })
          .catch((err) => {
            this.$message.error('Error! Please check your transaction!')
            console.error(err)
          })
      }

      reader.readAsArrayBuffer(file.raw)
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

.transaction-uploader .el-upload:focus {
  color: #000000;
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
