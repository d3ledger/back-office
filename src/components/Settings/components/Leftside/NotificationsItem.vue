<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsItem
    title="Notifications"
  >
    <el-row>
      <el-col>
        <el-switch
          v-model="notifications"
          @change="switchNotifications"
        />
      </el-col>
    </el-row>
  </SettingsItem>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import pushUtil from '@util/push-util'

export default {
  name: 'NotificationItem',
  components: {
    SettingsItem: lazyComponent('Settings/components/Leftside/SettingsItem')
  },
  props: {
    openApprovalDialog: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      notifications: false
    }
  },
  computed: {
    ...mapGetters([
      'subscribed'
    ])
  },
  created () {
    this.notifications = this.subscribed
  },
  methods: {
    ...mapActions([
      'subscribePushNotifications',
      'unsubscribePushNotifications'
    ]),
    subscribe (settings) {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.subscribePushNotifications({ privateKeys, settings })
        })
    },
    unsubscribe () {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.unsubscribePushNotifications({ privateKeys })
        })
    },
    switchNotifications (value) {
      if (value) {
        pushUtil.initialiseState(this.subscribe.bind(this))
      } else {
        this.unsubscribe()
      }
    }
  }
}
</script>

<style scoped>
</style>
