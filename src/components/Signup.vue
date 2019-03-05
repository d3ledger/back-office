<template>
  <el-container class="auth-container">
    <div style="margin-top: 2.5rem">
      <img src="@/assets/logo.svg" alt="D3"/>
    </div>
    <span class="auth-welcome">Sign Up</span>
    <div class="auth-form-container">
      <el-form
        class="auth-form"
        ref="form"
        :model="form"
        label-position="top"
      >
        <el-form-item label="Username" prop="username">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                name="username"
                v-model="$v.form.username.$model"
                :disabled="isLoading"
                :class="[
                  _isValid($v.form.username) ? 'border_success' : '',
                  _isError($v.form.username) ? 'border_fail' : ''
                ]"
              />
            </el-col>
            <div
              :class="[
                'auth-form_tag',
                _isValid($v.form.username) ? 'border_success' : '',
                _isError($v.form.username) ? 'border_fail' : ''
              ]"
            >d3</div>
          </el-row>
          <span
            v-if="_isError($v.form.username)"
            class="el-form-item__error"
          >Please provide correct username</span>
        </el-form-item>
        <el-form-item
          label="Registration IP"
          prop="nodeIp"
        >
          <el-select
            v-model="$v.form.nodeIp.$model"
            :disabled="isLoading"
            style="width: 100%;"
            filterable
            allow-create
            @change="selectNotaryIp"
            popper-class="black-form_select-dropdown"
              :class="[
                'auth-form_select',
                _isValid($v.form.nodeIp) ? 'border_success' : '',
                _isError($v.form.nodeIp) ? 'border_fail' : ''
              ]"
          >
            <el-option
              v-for="node in registrationIPs"
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
            data-cy="signup"
            class="auth-button fullwidth black"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            Sign Up
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth_goto-container">
        <p class="auth_goto-container-title">Already have an account?</p>
        <router-link
          to="/login"
        >
          <el-button data-cy="login" class="auth_goto-container-button fullwidth">
            Log in
          </el-button>
        </router-link>
      </div>
    </div>
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
import { mapActions, mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import messageMixin from '@/components/mixins/message'
import { registrationIPs } from '@/data/urls'

import { _nodeIp, _username, errorHandler } from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'signup',
  mixins: [
    messageMixin,
    errorHandler
  ],
  validations: {
    form: {
      username: {
        required,
        _username
      },
      nodeIp: {
        required,
        _nodeIp
      }
    }
  },
  data () {
    return {
      registrationIPs,
      isLoading: false,
      predefinedDomain: 'd3',
      form: {
        username: '',
        nodeIp: registrationIPs[0].value
      },
      dialogVisible: false,
      dialog: {
        username: '',
        privateKey: ''
      },
      downloaded: false
    }
  },

  beforeMount () {
    this.selectNotaryIp()
  },

  created () {
    this.getFreeBtcRelaysNumber()
    this.getFreeEthRelaysNumber()
  },

  computed: {
    ...mapGetters([
      'freeEthRelaysNumber',
      'freeBtcRelaysNumber'
    ])
  },

  methods: {
    ...mapActions([
      'setNotaryIp',
      'signup',
      'getFreeEthRelaysNumber',
      'getFreeBtcRelaysNumber'
    ]),

    onSubmit () {
      this.updateFreeRelaysRule()
      this.$refs['form'].validateField('nodeIp', (nodeIpErrorMessage) => {
        if (nodeIpErrorMessage) return false

        this.isLoading = true

        this.signup({
          username: this.form.username
        })
          .then(({ username, privateKey }) => {
            this.dialog.username = username
            this.dialog.privateKey = privateKey
            this.dialogVisible = true
          })
          .catch(err => {
            console.error(err)
            this.$_showRegistrationError(err.message, err.response)
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

    selectNotaryIp () {
      this.setNotaryIp({ ip: this.form.nodeIp })
      this.updateFreeRelaysRule()
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
    color: #ffffff;
  }

  .option.right {
    float: right;
    font-size: 0.8rem;
    color: #8492a6;
  }
</style>
