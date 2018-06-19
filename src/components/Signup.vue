<template>
  <el-container class="signup-container">
    <el-card class="signup-form-container">
      <div slot="header" class="clearfix">
        <router-link
          class="login-button"
          to="/login"
        >
          <i class="el-icon-arrow-left"></i>
          Login
        </router-link>
      </div>

      <el-form class="signup-form" ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="username:" prop="username">
          <el-input
            name="username"
            v-model="form.username"
            placeholder="e.g. alice, bob"
            :disabled="isLoading"
          >
            <template slot="append">@{{ predefinedDomain }}</template>
          </el-input>
        </el-form-item>

        <el-form-item class="signup-button-container">
          <el-button
            class="signup-button"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            Sign Up
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="Private key"
      :visible.sync="dialogVisible"
      :before-close="onCloseDialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span>Download your private key and keep it secret!</span>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onClickDownload"
        >
          <i class="el-icon-download"></i>
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
const FileSaver = require('file-saver')

export default {
  name: 'signup',

  data () {
    return {
      isLoading: false,
      predefinedDomain: 'test',
      form: {
        username: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}$/, message: 'Username should match [a-Z_0-9]{1,32}', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialog: {
        username: '',
        privateKey: ''
      },
      downloaded: false
    }
  },

  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false

        this.isLoading = true

        this.$store.dispatch('signup', {
          username: this.form.username
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
    }
  }
}
</script>

<style scoped>
  .signup-container {
    justify-content: center;
  }

  .signup-form-container {
    position: relative;
    width: 30rem;
    overflow: visible;
    margin-top: 5rem;
  }

  /*
    ElementUI renders .el-form-item__label without a data attribute,
    so scoped styles doesn't work for it. The `>>>` combinator solves this problem.
    https://vue-loader.vuejs.org/en/features/scoped-css.html
  */
  .signup-form >>> .el-form-item__label {
    line-height: 1;
  }

  .logo {
    width: 10rem;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;
    top: -5rem;
  }

  .signup-button-container {
    text-align: center;
    margin: 30px 0 10px;
  }

  .signup-button {
    height: 3rem;
    width: 8rem;
  }

  .login-button {
    float: left;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
