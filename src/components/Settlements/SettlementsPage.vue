<template>
  <el-container class="column-fullheight">
    <el-header height="59px" class="header">
      <el-row>
        <el-col :xs="24" :md="{ span: 20, offset: 2 }" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }"
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
        >
          <div style="display: flex;">
            <router-link class="navlink" to="/settlements/history">History</router-link>
            <router-link class="navlink" to="/settlements/incoming">Incoming</router-link>
            <router-link class="navlink" to="/settlements/outgoing">Outgoing</router-link>
          </div>
          <div>
            <el-button type="primary" @click="openExchangeDialog()" plain>
              <span style="vertical-align: middle;">
                <fa-icon icon="exchange-alt" />
                Exchange
              </span>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :xs="24" :md="{ span: 20, offset: 2 }" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <router-view />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {}
  },

  methods: {
    ...mapActions([
      'openExchangeDialog'
    ])
  }
}
</script>

<style scoped>
.header {
  background: white;
  padding: 0 20px;
  box-shadow: 0 1px 1px 0 #efefef;
}

.navlink {
  display: inline-block;
  color: rgba(0,0,0,0.32);
  font-size: 14px;
  line-height: 1;
  padding: 20px 50px;
  border-right: 1px solid #f4f4f4;
  font-weight: 500;
}

.navlink.router-link-active {
  color: black;
  background: #f4f4f4;
  padding-bottom: 24px;
  border-bottom: 1px solid #2d2d2d;
}
</style>
