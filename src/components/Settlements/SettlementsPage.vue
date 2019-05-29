<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container class="column-fullheight">
    <el-header
      :style="{ height: '3.9rem' }"
      class="header"
    >
      <el-row>
        <el-col
          :span="24"
          style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
        >
          <div style="display: flex;">
            <router-link
              class="navlink"
              to="/settlements/history"
            >History</router-link>
            <router-link
              class="navlink"
              to="/settlements/incoming"
            >Incoming</router-link>
            <router-link
              class="navlink"
              to="/settlements/outgoing"
            >Outgoing</router-link>
          </div>
          <div>
            <el-button
              class="exchange_button"
              size="medium"
              type="primary"
              @click="openExchangeDialog()"
            >
              <fa-icon
                class="exchange_button-icon"
                icon="exchange-alt"
              />
              <span>
                Exchange
              </span>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
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
}

.navlink {
  display: inline-block;
  color: rgba(0,0,0,0.32);
  font-size: 0.9rem;
  line-height: 1;
  padding: 20px 50px;
  border-right: 1px solid #f4f4f4;
  font-weight: 600;
}

.navlink.router-link-active {
  color: black;
  background: #f4f4f4;
  padding-bottom: 1.7rem;
  border-bottom: 1px solid #2d2d2d;
}
.exchange_button {
  background-color: #409eff;
  border: 0;
  text-transform: uppercase;
  border-radius: 2px;
  font-size: 0.8rem;
  line-height: 1rem;
}
.exchange_button-icon {
  margin-right: 0.7rem;
}
</style>
