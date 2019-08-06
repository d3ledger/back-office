<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsItem
    title="Notifications"
  >
    <!-- <el-row>
      <el-col>
        <b>Push notifications:</b>
        <el-switch
          v-model="pushNotifications"
          @change="switchPushNotifications"
        />
      </el-col>
    </el-row> -->
    <el-row>
      <el-col>
        <span>
          Email:
          {{ email }}
        </span>
        <el-button
          size="small"
          @click="openEditEmailDialog()"
        >
          {{ email.length > 0 ? 'Edit' : 'Add' }}
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        Email notifications:
        <el-switch
          v-bind="notifications"
          @change="switchNotifications"
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
          v-model="emailAddress"
          type="email"
        />
      </div>
      <div
        slot="footer"
        class="dialog-form_buttons-block"
      >
        <el-button
          class="dialog-form_buttons close"
          @click="isEditEmailDialogVisible = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          class="dialog-form_buttons action"
          @click="editEmail()"
        >
          Save
        </el-button>
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
      emailAddress: '',
      emailNotifications: false,
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
    this.emailNotifications = this.notifications
  },
  methods: {
    ...mapActions([
      'subscribePushNotifications',
      'unsubscribePushNotifications',
      'setEmail',
      'createSetEmailTransaction',
      'switchEmailNotifications',
      'createSwitchEmailNotificationsTransaction'
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
      this.createSetEmailTransaction({ notifications })
    },
    openEditEmailDialog () {
      this.isEditEmailDialogVisible = true
    },
    editEmail () {
      this.createSetEmailTransaction({ email: this.emailAddress })
      this.isEditEmailDialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
