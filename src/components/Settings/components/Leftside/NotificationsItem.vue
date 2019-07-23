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
          v-model="pushNotifications"
          @change="switchPushNotifications"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        Email notifications
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        {{ email }}
        <el-button
          @click="openEditEmailDialog()"
        >
          Edit
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-switch
          v-model="notifications"
          @change="switchEmailNotifications"
        />
      </el-col>
    </el-row>
    <el-dialog
      :visible="isEditEmailDialogVisible"
      data-cy="editEmailModal"
      title="Edit email"
      width="450px"
      center
      @close="isEditEmailDialogVisible = false"
    >
      <div>
        <el-input
          :model="email"
          type="email"
        />
      </div>
      <div>
        <el-button @click="isEditEmailDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="editEmail()"
        >Save</el-button>
      </div>
    </el-dialog>
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
      pushNotifications: false,
      isEditEmailDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'subscribed',
      'email',
      'notifications'
    ])
  },
  created () {
    this.pushNotifications = this.subscribed
  },
  methods: {
    ...mapActions([
      'subscribePushNotifications',
      'unsubscribePushNotifications',
      'setEmail',
      'switchEmailNotifications'
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
    switchPushNotifications (value) {
      if (value) {
        pushUtil.initialiseState(this.subscribe.bind(this))
      } else {
        this.unsubscribe()
      }
    },
    switchNotifications (notifications) {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.switchEmailNotifications({ privateKeys, notifications })
        })
    },
    openEditEmailDialog () {

    },
    editEmail () {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.setEmail({ privateKeys, email: this.email })
        })
    }

  }
}
</script>

<style scoped>
</style>
