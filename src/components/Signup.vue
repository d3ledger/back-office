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
        >
        <span class="auth-header_title">Register in D3</span>
      </div>
      <div class="auth-form-container">
        <el-form
          ref="form"
          :model="form"
          class="auth-form"
          label-position="top"
        >
          <el-form-item
            label="Username"
            prop="username"
          >
            <el-input
              v-model="$v.form.username.$model"
              :disabled="isLoading"
              :class="[
                'fullwidth',
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
            label="Public key"
            prop="publicKey"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="24">
                <el-input
                  v-model="$v.form.publicKey.$model"
                  :disabled="isLoading"
                  :class="[
                    'auth-form_upload-input',
                    _isValid($v.form.publicKey) ? 'border_success' : '',
                    _isError($v.form.publicKey) ? 'border_fail' : ''
                  ]"
                  name="publicKey"
                />
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="onFileChosen"
                  :disabled="isLoading"
                  :class="[
                    'auth-form_upload',
                    _isValid($v.form.publicKey) ? 'border_success' : '',
                    _isError($v.form.publicKey) ? 'border_fail' : ''
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
              v-if="_isError($v.form.publicKey)"
              class="el-form-item__error"
            >{{ _showError($v.form.publicKey) }}</div>
          </el-form-item>
          <el-form-item
            label="Registration IP"
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
              @change="selectNotaryIp"
            >
              <el-option
                v-for="node in registrationIPs"
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
                  data-cy="register"
                  class="auth-button black fullwidth"
                  type="primary"
                  @click="onSubmit"
                >
                  Register
                </el-button>
              </el-col>
              <el-col
                :span="12"
                class="auth_button_actions-msg"
              >
                <span>Already have an account?</span>
                <router-link
                  to="/signin"
                  data-cy="toLoginPage"
                >
                  <span class="actions-msg_red-link pointed">Login</span>
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
import { mapActions, mapGetters } from 'vuex'
import messageMixin from '@/components/mixins/message'

import { _nodeIp, _user, _keyPattern, errorHandler } from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Signup',
  mixins: [
    messageMixin,
    errorHandler
  ],
  validations: {
    form: {
      username: {
        required,
        _userName: _user.nameDomain
      },
      nodeIp: {
        required,
        _nodeIp
      },
      publicKey: {
        required: required,
        _keyPattern
      }
    }
  },
  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        nodeIp: '',
        publicKey: ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'registrationIPs'
    ])
  },

  created () {
    this.form.nodeIp = this.registrationIPs[0].value || ''
  },

  beforeMount () {
    this.selectNotaryIp()
  },

  mounted () {
    document.documentElement.style.setProperty('--show-loading', 'none')
  },

  methods: {
    ...mapActions([
      'setNotaryIp',
      'signupWithKey'
    ]),

    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.isLoading = true

      this.selectNotaryIp()

      this.signupWithKey({
        username: this.form.username,
        publicKey: this.form.publicKey
      })
        .then(() => {
          this.$message.success('Success! Registration completed!')
          this.$router.push('/login')
        })
        .catch(err => {
          console.error(err)
          this.$_showRegistrationError(err.message, err.response)
        })
    },

    selectNotaryIp () {
      this.setNotaryIp({ ip: this.form.nodeIp })
    },

    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.publicKey = (ev.target.result || '').trim()
        this.$v.$touch()
      }

      reader.readAsText(file.raw)
    }
  }
}
</script>

<style scoped>
  .auth-form_tag {
    width: 3.8rem;
    height: 4.5rem;
    border: solid 1px rgba(255, 255, 255, 0.4);
    background-color: #363636;
    color: #ffffff;
    padding-top: 1rem;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.2rem;
    border-radius: 0.3rem;
    line-height: 2
  }

  .auth_whitelist {
    margin: 3rem 0 0 0;
    height: 4rem;
    overflow-y: scroll;
  }

  .auth_whitelist >>> .el-form-item__content {
    display: flex;
  }

  .auth_whitelist-tag {
    background-color: #363636;
    border: solid 1px rgba(255, 255, 255, 0.4);
    color: #ffffff;
    opacity: 0.8;
  }

  .auth_whitelist-tag >>> i {
    color: #ffffff;
    opacity: 0.8;
  }

  .auth_whitelist-tag >>> .el-icon-close:hover {
    opacity: 1;
    background-color: #505050;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .el-tag {
    margin-right: 1rem;
  }

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

  .checkbox_key {
    color: rgba(255, 255, 255, 0.4);
    background-color: #363636;
    color: rgba(255, 255, 255, 0.8);
    border: solid 1px rgba(255, 255, 255, 0.4);
    font-weight: 700;
    height: 4.5rem;
    padding-left: 1.2rem;
    padding-top: 1.2rem;
    line-height: 2;
    font-size: 1rem;
  }

  .checkbox_key >>> .el-checkbox__label {
    font-size: 1rem;
  }

  .checkbox_key.is-checked {
    border-color: rgba(255, 255, 255, 0.4);
  }

  .checkbox_key.is-checked >>> .el-checkbox__label {
    font-size: 1rem;
    color: #ffffff;
  }

  .checkbox_key.is-checked >>> .el-checkbox__inner {
    background-color: #ffffff;
    border-color: #ffffff;
  }

  .checkbox_key.is-checked >>> .el-checkbox__inner::after {
    border-color: black;
  }
</style>
