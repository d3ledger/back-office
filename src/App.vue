<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'App',

  computed: mapState({
    connectionError: state => state.Account.connectionError
  }),

  watch: {
    connectionError (to) {
      if (to) this.showConnectionErrorMessage(to)
    }
  },

  methods: {
    showConnectionErrorMessage: _.debounce(function () {
      this.$message.error(`connection error: Please check IP address OR your internet connection`)
    }, 1000)
  }
}
</script>

<style>
html,
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: #363636;
}

a {
  color: black;
  transition: opacity .15s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  opacity: 0.8;
}

.column-fullheight {
  height: 100vh;
  overflow: auto;
}

.flex-direction-column {
  flex-direction: column;
}

.flex-direction-row {
  flex-direction: row;
}

.el-message,
.el-message-box,
.el-popper,
.el-tooltip__popper, .el-select-dropdown__item {
  font-family: 'IBM Plex Sans', sans-serif;
}

.form-item-text {
  font-size: 14px;
  opacity: 0.7;
}

.form-item-text-amount {
  font-weight: 500;
}

.fullwidth.el-button {
  width: 100%;
  min-height: 40px;
  text-transform: uppercase;
}

.black.el-button {
  color: white;
  background: #041820;
  border: 1px solid #041820;
}

.black.el-button:hover {
  color: white;
  background: #36464D;
  border: 1px solid #36464D;
}

.monospace {
  font-family: 'IBM Plex Sans', sans-serif;
}

.bold {
  font-weight: bold;
}

button.el-dialog__headerbtn {
  font-size: 1.25rem;
}

.fullheight {
  height: 100%;
}
</style>
