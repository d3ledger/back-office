/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import NOTIFICATIONS from '@/data/notifications'

const getErrorMessage = (error) => {
  const irohaErrors = Object.keys(NOTIFICATIONS.IROHA)
  const isIncludesList = irohaErrors.map(e => error.includes(e))
  const index = isIncludesList.findIndex(bool => bool)
  return index === -1 ? error : NOTIFICATIONS.IROHA[irohaErrors[index]]
}

const message = {
  methods: {
    $_showMessageFromStatus (isCompleted, messageCompleted, messageIncompleted) {
      let message = isCompleted
        ? messageCompleted
        : messageIncompleted

      let type = isCompleted
        ? 'success'
        : 'warning'

      this.$message({
        message,
        type
      })
    },
    $_showErrorAlertMessage (message, windowName) {
      const errorMsg = getErrorMessage(message)
      this.$alert(errorMsg, windowName, {
        type: 'error'
      })
    },
    $_showRegistrationError (message, response) {
      let responseText = response ? response.data : ''
      if (responseText.includes('no free')) {
        message = 'No free address to register'
      }
      this.$_showErrorAlertMessage(message, 'Sign up error')
    }
  }
}

export default message
