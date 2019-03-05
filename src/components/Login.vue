<template>
  <el-container class="auth-container">
    <div style="margin-top: 2.5rem">
      <img src="@/assets/logo.svg" alt="D3"/>
    </div>
    <span class="auth-welcome">Welcome to D3</span>
    <div class="auth-form-container">
      <el-form
        @keyup.enter.native="onSubmit"
        class="auth-form"
        ref="form"
        :model="form"
        label-position="top"
      >
        <el-form-item label="Private key" prop="privateKey">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                name="privateKey"
                v-model="$v.form.privateKey.$model"
                :disabled="isLoading"
                :class="[
                  _isValid($v.form.privateKey) ? 'border_success' : '',
                  _isError($v.form.privateKey) ? 'border_fail' : ''
                ]"
              />
            </el-col>

            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChosen"
              :disabled="isLoading"
              :class="[
                'auth-form_upload',
                _isValid($v.form.privateKey) ? 'border_success' : '',
                _isError($v.form.privateKey) ? 'border_fail' : ''
              ]"
            >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
          </el-row>
          <span
            v-if="_isError($v.form.privateKey)"
            class="el-form-item__error"
          >Please provide correct private key</span>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input
            name="username"
            v-model="$v.form.username.$model"
            :disabled="isLoading"
            :class="[
              _isValid($v.form.username) ? 'border_success' : '',
              _isError($v.form.username) ? 'border_fail' : ''
            ]"
          />
          <span
            v-if="_isError($v.form.username)"
            class="el-form-item__error"
          >Please provide correct username</span>
        </el-form-item>
        <el-form-item label="Node IP" prop="nodeIp">
          <el-select
            v-model="$v.form.nodeIp.$model"
            :disabled="isLoading"
            style="width: 100%;"
            filterable
            allow-create
            popper-class="black-form_select-dropdown"
            :class="[
              'auth-form_select',
              _isValid($v.form.nodeIp) ? 'border_success' : '',
              _isError($v.form.nodeIp) ? 'border_fail' : ''
            ]"
          >
            <el-option
              v-for="node in listOfNodes"
              :key="node.value"
              :label="node.label"
              :value="node.value">
              <span class="option left">{{ node.label }}</span>
              <span class="option right">{{ node.value }}</span>
            </el-option>
          </el-select>
          <span
            v-if="_isError($v.form.nodeIp)"
            class="el-form-item__error"
          >Please provide correct node ip</span>
        </el-form-item>
        <el-form-item class="auth-button-container">
          <el-button
            data-cy="login"
            class="auth-button fullwidth black"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            Log in
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth_goto-container">
        <p class="auth_goto-container-title">Don’t have an account?</p>
        <router-link
          to="/signup"
        >
          <el-button data-cy="signup" class="auth_goto-container-button fullwidth">
            Sign up
          </el-button>
        </router-link>
      </div>
    </div>
  </el-container>
</template>

<script>
import listOfNodes from '@/data/nodes'
import messageMixin from '@/components/mixins/message'
import { mapActions } from 'vuex'

import {
  _keyPattern,
  _nodeIp,
  _usernameWithDomain,
  errorHandler
} from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'login',
  mixins: [
    messageMixin,
    errorHandler
  ],
  validations: {
    form: {
      username: {
        required,
        _usernameWithDomain
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
      listOfNodes
    }
  },

  created () {
    const nodeIp = this.$store.state.Account.nodeIp
    this.form.nodeIp = nodeIp || this.listOfNodes[0].value
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
    }
  }
}
</script>

<style scoped>
  .option.left {
    float: left;
    margin-right: 10px;
    color: #ffffff;
  }

  .option.right {
    float: right;
    font-size: 0.8rem;
    color: #8492a6;
  }
</style>
