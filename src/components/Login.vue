<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container class="flex-center">
    <div class="auth-container">
      <div class="auth-header">
        <img
          src="@/assets/logo.svg"
          alt="D3"
          class="auth-header_logo"
          @click="onShowVersion"
        >
        <span class="auth-header_title">Log in to D3</span>
      </div>
      <div class="auth-form-container">
        <el-form
          ref="form"
          :model="form"
          class="auth-form"
          label-position="top"
          @keyup.enter.native="onSubmit"
        >
          <el-form-item
            label="Private key"
            prop="privateKey"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="24">
                <el-input
                  v-model="$v.form.privateKey.$model"
                  :disabled="isLoading"
                  :class="[
                    'auth-form_upload-input',
                    _isValid($v.form.privateKey) ? 'border_success' : '',
                    _isError($v.form.privateKey) ? 'border_fail' : ''
                  ]"
                  name="privateKey"
                  type="password"
                />
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="onFileChosen"
                  :disabled="isLoading"
                  :class="[
                    'auth-form_upload',
                    _isValid($v.form.privateKey) ? 'border_success' : '',
                    _isError($v.form.privateKey) ? 'border_fail' : ''
                  ]"
                  action=""
                >
                  <el-button>
                    <img
                      src="@/assets/icons/download.svg"
                      alt=""
                      srcset=""
                    >
                  </el-button>
                </el-upload>
              </el-col>
            </el-row>
            <div
              v-if="_isError($v.form.privateKey)"
              class="el-form-item__error"
            >{{ _showError($v.form.privateKey) }}</div>
          </el-form-item>
          <el-form-item
            label="Username"
            prop="username"
          >
            <el-input
              v-model="$v.form.username.$model"
              :disabled="isLoading"
              :class="[
                _isValid($v.form.username) ? 'border_success' : '',
                _isError($v.form.username) ? 'border_fail' : ''
              ]"
              name="username"
            />
            <div
              v-if="_isError($v.form.username)"
              class="el-form-item__error"
            >{{ _showError($v.form.username) }}</div>
          </el-form-item>
          <el-form-item
            label="Node IP"
            prop="nodeIp"
          >
            <el-select
              v-model="$v.form.nodeIp.$model"
              :disabled="isLoading"
              :class="[
                'fullwidth',
                _isValid($v.form.nodeIp) ? 'border_success' : '',
                _isError($v.form.nodeIp) ? 'border_fail' : ''
              ]"
              style="z-index: 1;"
              filterable
              allow-create
              popper-class="black-form_select-dropdown"
            >
              <el-option
                v-for="node in nodeIPs"
                :key="node.value"
                :label="node.label"
                :value="node.value"
              >
                <span class="option left">{{ node.label }}</span>
                <span class="option right">{{ node.value }}</span>
              </el-option>
            </el-select>
            <div
              v-if="_isError($v.form.nodeIp)"
              class="el-form-item__error"
            >{{ _showError($v.form.nodeIp) }}</div>
          </el-form-item>
          <el-form-item class="auth-button-container">
            <el-row class="auth-button_actions">
              <el-col
                :span="12"
                class="auth-button_actions-button"
              >
                <el-button
                  :loading="isLoading"
                  data-cy="login"
                  class="auth-button black fullwidth"
                  type="primary"
                  @click="onSubmit"
                >
                  Login
                </el-button>
              </el-col>
              <el-col
                :span="12"
                class="auth_button_actions-msg"
              >
                <span>Don't have an account?</span>
                <router-link to="/signup">
                  <span class="actions-msg_red-link pointed">Register</span>
                </router-link>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>
import messageMixin from '@/components/mixins/message'
import { mapActions, mapGetters } from 'vuex'

import {
  _keyPattern,
  _nodeIp,
  _user,
  errorHandler
} from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [
    messageMixin,
    errorHandler
  ],
  validations: {
    form: {
      username: {
        required,
        _userDomain: _user.nameDomain
      },
      privateKey: {
        required,
        _keyPattern
      },
      nodeIp: {
        required,
        _nodeIp
      }
    }
  },
  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        privateKey: '',
        nodeIp: this.$store.state.Account.nodeIp
      },

      versionTimeout: null,
      countToShowVersion: 0
    }
  },

  computed: {
    ...mapGetters([
      'nodeIPs'
    ])
  },

  created () {
    const nodeIp = this.$store.state.Account.nodeIp
    this.form.nodeIp = nodeIp || this.nodeIPs[0].value
  },

  mounted () {
    document.documentElement.style.setProperty('--show-loading', 'none')
  },

  methods: {
    ...mapActions([
      'login'
    ]),
    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.privateKey = (ev.target.result || '').trim()
        this.form.username = fileList[fileList.length - 1].name.replace('.priv', '')
        this.$v.$touch()
      }

      reader.readAsText(file.raw)
    },

    onSubmit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isLoading = true

        const nodeIp = this.form.nodeIp.includes('://') ? this.form.nodeIp : `http://${this.form.nodeIp}`
        this.login({
          username: this.form.username,
          privateKey: this.form.privateKey,
          nodeIp
        })
          .then(account => {
            this.$router.push('/')
          })
          .catch(err => {
            console.error(err)
            this.$_showErrorAlertMessage(err.message, 'Login error')
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },

    beforeShowVersion () {
      this.versionTimeout = setTimeout(_ => this.afterShowVersion(), 3 * 1000)
    },

    onShowVersion () {
      if (!this.versionTimeout) this.beforeShowVersion()

      if (this.countToShowVersion === 10) {
        const full = process.env.VUE_APP_COMMIT_HASH
        const short = process.env.VUE_APP_COMMIT_HASH_SHORT
        console.group('D3 - Information')
        console.info(`Full version: ${full}`)
        console.info(`Short version: ${short}`)
        console.groupEnd()
      }
      this.countToShowVersion += 1
    },

    afterShowVersion () {
      clearTimeout(this.versionTimeout)

      this.countToShowVersion = 0
      this.versionTimeout = null
    }
  }
}
</script>

<style scoped>
  .option.left {
    float: left;
    margin-right: 10px;
    font-size: 1rem;
    color: #000000;
  }

  .option.right {
    float: right;
    font-size: 1rem;
    color: #000000;
  }
</style>
