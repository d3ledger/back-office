import NOTIFICATIONS from '@/data/notifications'

const getErrorMessage = (error) => {
  // const irohaErrors = NOTIFICATIONS.IROHA
  const irohaErrors = Object.keys(NOTIFICATIONS.IROHA)
  const r = irohaErrors.map((e) => error.includes(e))
  const b = r.findIndex((o) => o)
  return NOTIFICATIONS.IROHA[irohaErrors[b]]
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
    }
  }
}

export default message
