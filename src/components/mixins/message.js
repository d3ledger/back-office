import NOTIFICATIONS from '@/data/notifications'

const getErrorMessage = (error) => {
  console.log(error)
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
    }
  }
}

export default message
