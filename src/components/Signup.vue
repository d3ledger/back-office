<template>
  <el-container class="signup-container">
    <div style="margin-top: 4rem">
      <h1 style="font-size: 2.5rem">Sign Up</h1>
    </div>
    <el-card class="signup-form-container">
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
          class="el-button fullwidth el-button--info is-plain"
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
import FileSaver from 'file-saver'

export default {
  name: 'signup',

  data () {
    return {
      isLoading: false,
      predefinedDomain: 'notary',
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
</style>
