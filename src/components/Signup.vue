<template>
  <el-container class="signup-container">
    <div style="margin-top: 4rem">
      <h1 class="signup-title">Sign Up</h1>
    </div>
    <el-card class="signup-form-container">
      <el-form class="signup-form" ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Username:" prop="username">
          <el-input
            name="username"
            v-model="form.username"
            placeholder="e.g. alice, bob"
            :disabled="isLoading"
          >
            <template slot="append">@{{ predefinedDomain }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Whitelist address:" prop="newAddress" ref="newAddress">
          <el-input
            name="newAddress"
            v-model="form.newAddress"
            placeholder="e.g. 0x00000000..."
            style="width: 355px"
          >
          </el-input>
          <el-button
            class="blue"
            type="primary"
            @click="onClickAddAddressToWhiteList"
            :loading="isLoading"
            style="margin-left: 10px; float: right;"
          >
            <span v-if="!isLoading">
              ADD
            </span>
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.whitelist.length">
          <p>You will be allowed to withdraw to these addresses:</p>
          <el-tag
            v-for="(item, idx) in form.whitelist"
            :key="item"
            size="default"
            type="success"
            closable
            @close="() => onClickRemoveItemFromWitelist(idx)"
          >
            {{ item }}
          </el-tag>
        </el-form-item>
        <el-form-item
          v-if="this.$route.fullPath.includes('#url')"
          label="Registration ip:"
          prop="nodeIp"
        >
          <el-select
            v-model="form.nodeIp"
            :disabled="isLoading"
            style="width: 100%;"
            filterable
            allow-create
            @change="selectNotaryIp"
          >
            <el-option
              v-for="node in notaryIPs"
              :key="node.value"
              :label="node.label"
              :value="node.value">
              <span class="option left">{{ node.label }}</span>
              <span class="option right">{{ node.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="signup-button-container">
          <el-button
            class="fullwidth black"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            Sign Up
          </el-button>
        </el-form-item>
      </el-form>
      <div style="margin-top: 3rem">
        <p style="margin-bottom: 1rem">Already have an account?</p>
        <router-link
          to="/login"
          class="el-button fullwidth primary"
        >
          Login
        </router-link>
      </div>
    </el-card>

    <el-dialog
      title="Private key"
      :visible.sync="dialogVisible"
      :before-close="onCloseDialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="400px"
      center
    >
      <div class="dialog-content">
        <span>Download your private key and keep it secret!</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="black"
          @click="onClickDownload"
        >
          <fa-icon icon="download"/>
          Download
        </el-button>

        <el-button
          type="default"
          @click="onCloseDialog"
          :disabled="!downloaded"
        >
          Confirm
        </el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import FileSaver from 'file-saver'
import inputValidation from '@/components/mixins/inputValidation'
import notaryIPs from '@/data/notaryIPs.json'

export default {
  name: 'signup',
  mixins: [
    inputValidation({
      username: 'name',
      newAddress: 'walletAddress',
      nodeIp: 'nodeIp'
    })
  ],
  data () {
    return {
      notaryIPs,
      isLoading: false,
      predefinedDomain: 'notary',
      form: {
        username: '',
        newAddress: '',
        whitelist: [],
        nodeIp: ''
      },
      dialogVisible: false,
      dialog: {
        username: '',
        privateKey: ''
      },
      downloaded: false
    }
  },

  computed: {
    ...mapState({
      notaryIp: state => state.Account.notaryIp
    })
  },

  beforeMount () {
    this.updateWhiteListValidationRules()
  },

  methods: {
    ...mapActions([
      'setNotaryIp'
    ]),

    onSubmit () {
      this.$refs['newAddress'].clearValidate()
      this.$refs['form'].validateField('username', (usernameErrorMessage) => {
        if (usernameErrorMessage) return false

        this.isLoading = true

        this.$store.dispatch('signup', {
          username: this.form.username,
          whitelist: this.form.whitelist
        })
          .then(({ username, privateKey }) => {
            this.dialog.username = username
            this.dialog.privateKey = privateKey
            this.dialogVisible = true
          })
          .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Sign up error', {
              type: 'error'
            })
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },

    onCloseDialog () {
      this.dialogVisible = false
      this.$router.push('/login')
    },

    onClickDownload () {
      const filename = `${this.dialog.username}@${this.predefinedDomain}.priv`
      const blob = new Blob(
        [this.dialog.privateKey],
        { type: 'text/plain;charset=utf-8' }
      )

      FileSaver.saveAs(blob, filename)

      this.downloaded = true
    },

    onClickAddAddressToWhiteList () {
      this.$refs['form'].validateField('newAddress', (errorMessage) => {
        if (errorMessage) return

        this.form.whitelist.push(this.form.newAddress)
        this.$refs['newAddress'].resetField()

        this.updateWhiteListValidationRules()
      })
    },

    onClickRemoveItemFromWitelist (index) {
      this.form.whitelist.splice(index, 1)

      /*
        Update validation rules + re-validate inserted field
      */
      this.updateWhiteListValidationRules()
      this.$refs['form'].validateField('newAddress')
    },

    updateWhiteListValidationRules () {
      this._refreshRules({
        newAddress: { pattern: 'walletAddress', wallets: this.form.whitelist }
      })
    },
    selectNotaryIp () {
      this.setNotaryIp({ ip: this.form.nodeIp })
    }
  }
}
</script>

<style scoped>
  .signup-title {
    font-size: 2.5rem;
    color: #ffffff;
  }
  .signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .signup-form-container {
    position: relative;
    width: 30rem;
    overflow: visible;
    margin-top: 3rem;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /*
    ElementUI renders .el-form-item__label without a data attribute,
    so scoped styles doesn't work for it. The `>>>` combinator solves this problem.
    https://vue-loader.vuejs.org/en/features/scoped-css.html
  */
  .signup-form >>> .el-form-item__label {
    line-height: 1;
  }

  .signup-form >>> .el-form-item__label::before {
    content: '';
  }

  .el-tag {
    margin-right: 10px;
  }

  .signup-settings {
    float: right;
    cursor: pointer;
    line-height: 1;
    margin-bottom: 10px;
  }

  .option.left {
    float: left;
  }

  .option.right {
    float: right;
    font-size: 0.8rem;
    color: #8492a6;
  }
</style>
