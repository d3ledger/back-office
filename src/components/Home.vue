<template>
  <el-container>
    <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
      <el-menu
        :router="true"
        :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
        text-color="#a2a2a2"
        background-color="#2D2D2D"
        active-text-color="#000"
        :default-active="currentActiveMenu"
        >
        <h1 class="logo">D3</h1>
        <el-menu-item index="/">
          <fa-icon icon="chart-line" class="menu-icon" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/wallets">
          <fa-icon icon="wallet" class="menu-icon" />
          <span slot="title">Wallets</span>
        </el-menu-item>
        <el-menu-item index="/settlements/history">
          <fa-icon icon="exchange-alt" class="menu-icon" />
          <span slot="title">Settlements</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <fa-icon icon="file-invoice" class="menu-icon" />
          <span slot="title">Reports</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <fa-icon icon="cog" class="menu-icon" />
          <span slot="title">Settings</span>
        </el-menu-item>
        <el-menu-item index="/logout" @click="logout">
          <fa-icon icon="sign-out-alt" class="menu-icon" />
          <span slot="title">Logout</span>
        </el-menu-item>
      </el-menu>
    </div>
    <el-main style="width: 100%; height: 100vh; padding: 0; padding-left: 62px;">
      <router-view />
    </el-main>
    <el-dialog
      title="Approve transaction"
      :visible="approvalDialogVisible"
      width="500px"
      @close="closeApprovalDialogWith()"
      center
      >
      <el-form label-position="top">
        <el-form-item>
          Please enter your private key to confirm transaction
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="space-between">
            <el-col :span="20">
              <el-input
                name="privateKey"
                placeholder="Your private key"
                v-model="privateKey"
              />
            </el-col>

            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChosen"
              >
              <el-button>
                <fa-icon icon="upload" />
              </el-button>
            </el-upload>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button
            class="fullwidth black clickable"
            @click="closeApprovalDialogWith(privateKey)"
            >
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',

  data () {
    return {
      privateKey: null,
      isCollapsed: true
    }
  },

  computed: {
    numberOfSettlements () {
      return this.$store.getters.waitingSettlements.length
    },

    ...mapState({
      accountId: (state) => state.Account.accountId,
      approvalDialogVisible: (state) => state.App.approvalDialogVisible
    }),

    currentActiveMenu: function () {
      if (this.$route.path.includes('wallets')) return '/wallets'
      if (this.$route.path.includes('settlements')) return '/settlements/history'
      return this.$route.path
    }
  },

  created () {
    this.$store.dispatch('getAllUnsignedTransactions')
    this.$store.dispatch('loadSettings')
  },

  methods: {
    ...mapActions([
      'closeApprovalDialog'
    ]),

    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    },

    closeApprovalDialogWith (privateKey) {
      this.closeApprovalDialog(privateKey)
      this.privateKey = null
    },

    onFileChosen (file, fileList) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        this.privateKey = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
    }
  }
}
</script>

<style>
.el-menu-item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.el-side-menu {
  height: 100vh;
  overflow-y: auto;
  transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-right: none;
  z-index: 100;
  width: 62px;

  /* Getting rid of element.ui styles */
  position: fixed !important;
  border-right: none !important;
}

.el-side-menu:not(.el-menu--collapse) {
  width: 160px;
}

.el-side-menu > .el-menu-item.is-active{
  background: white !important;
  color: black;
}

.logo {
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
}

.menu-icon {
  margin-left: 2px;
  margin-right: 8px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>
