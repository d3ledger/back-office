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
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="Private key" prop="privateKey">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                name="privateKey"
                v-model="form.privateKey"
                :disabled="isLoading"
              />
            </el-col>

            <el-upload
              class="auth-form_upload"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChosen"
              :disabled="isLoading"
            >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
          </el-row>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input
            name="username"
            v-model="form.username"
            :disabled="isLoading"
          />
        </el-form-item>
        <el-form-item label="Node IP" prop="nodeIp">
          <el-select
            v-model="form.nodeIp"
            :disabled="isLoading"
            style="width: 100%;"
            filterable
            allow-create
            popper-class="black-form_select-dropdown"
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
        </el-form-item>
        <el-form-item class="auth-button-container">
          <el-button
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
          <el-button class="auth_goto-container-button fullwidth">
            Sign up
          </el-button>
        </router-link>
      </div>
    </div>
  </el-container>
</template>

<script>
import inputValidation from '@/components/mixins/inputValidation'
import listOfNodes from '@/data/nodes'
import messageMixin from '@/components/mixins/message'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  mixins: [
    messageMixin,
    inputValidation({
      username: 'nameDomain',
      privateKey: 'privateKeyRequired',
      nodeIp: 'nodeIp'
    })
  ],
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

  beforeMount () {
    this._refreshRules({
      nodeIp: { pattern: 'nodeIp' }
    })
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
        this.$refs['form'].validate()
      }

      reader.readAsText(file.raw)
    },

    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false

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
      })
    }
  }
}
</script>

<style scoped>
  /*
    ElementUI renders .el-form-item__label without a data attribute,
    so scoped styles doesn't work for it. The `>>>` combinator solves this problem.
    https://vue-loader.vuejs.org/en/features/scoped-css.html
  */

  .auth-form >>> .el-form-item__label::before {
    display: none;
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
