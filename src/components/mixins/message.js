const message = {
  methods: {
    showMessageFromStatus (isCompleted, messageCompleted, messageIncompleted) {
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
    }
  }
}

export default message
