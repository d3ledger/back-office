<template>
  <el-container class="login-container">
    <div style="margin-top: 4rem">
      <h1 style="font-size: 2.5rem">Login</h1>
    </div>
    <el-card class="login-form-container">
      <el-form class="login-form" ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="username:" prop="username">
          <el-input
            name="username"
            v-model="form.username"
            :disabled="isLoading"
          />
        </el-form-item>

        <el-form-item label="private key:" prop="privateKey">
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                name="privateKey"
                v-model="form.privateKey"
                :disabled="isLoading"
              />
            </el-col>

            <el-upload
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

        <el-form-item label="node ip:" prop="nodeIp">
          <el-input
            v-model="form.nodeIp"
            :disabled="isLoading"
          ></el-input>
        </el-form-item>

        <el-form-item class="login-button-container">
          <el-button
            class="fullwidth black"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
      <div style="margin-top: 3rem">
        <p style="margin-bottom: 1rem">Don't have an account?</p>
        <router-link
          to="/signup"
          class="el-button fullwidth el-button--info is-plain"
        >
          Sign Up
        </router-link>
      </div>
    </el-card>
  </el-container>
</template>

<script>
export default {
  name: 'login',

  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        privateKey: '',
        nodeIp: this.$store.state.Account.nodeIp
      },
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, message: 'Username should match [a-Z_0-9]{1,32}@[a-Z_0-9]{1,9}', trigger: 'change' }
        ],
        privateKey: [
          { required: true, message: 'Please input private key', trigger: 'change' },
          { pattern: /^[A-Za-z0-9]{64}$/, message: 'Private key should match [A-Za-z0-9]{64}', trigger: 'change' }
        ],
        nodeIp: [
          { required: true, message: 'Please input node ip', trigger: 'change' },
          // Check an input as IP if it starts with 0-9 (e.g. "255.255.255.255", "255.255.255.255:12345"), or treat the input as a domain name and accept it with no validation.
          { pattern: /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?$|^[^0-9])/, message: 'Invalid IP', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
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

        this.$store.dispatch('login', {
          username: this.form.username,
          privateKey: this.form.privateKey,
          nodeIp: (this.form.nodeIp.indexOf('://') === -1) ? 'http://' + this.form.nodeIp : this.form.nodeIp
        })
          .then(account => {
            this.$router.push('/')
          })
          .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Login error', {
              type: 'error'
            })
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
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form-container {
    position: relative;
    width: 30rem;
    overflow: visible;
    margin-top: 3rem;
  }

  /*
    ElementUI renders .el-form-item__label without a data attribute,
    so scoped styles doesn't work for it. The `>>>` combinator solves this problem.
    https://vue-loader.vuejs.org/en/features/scoped-css.html
  */
  .login-form >>> .el-form-item__label {
    line-height: 1;
  }
</style>
