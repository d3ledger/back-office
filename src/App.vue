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
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: #f4f4f4;
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
  transition: opacity .15s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}

.clickable:hover {
  opacity: 0.8;
}

.column-fullheight {
  height: 100vh;
  overflow: scroll;
}

.el-tooltip__popper, .el-select-dropdown__item {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.form-item-text {
  font-size: 14px;
  opacity: 0.7;
}

.form-item-text-amount {
  font-weight: 500;
}

.blue-form-wrapper {
  background: #1B2936;
  background: #669dd5;

  color: white;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.blue-form-wrapper .el-form-item__label {
  color: white;
}

.blue-form-wrapper .el-input__inner, .blue-form-wrapper .el-textarea__inner {
  border-color: #ffffff80;
  background: transparent;
  color: white;
}

.blue-form-wrapper .el-input__inner:focus, .blue-form-wrapper .el-textarea__inner:focus {
  border-color: white !important;
  background-color: rgba(255, 255, 255, 0.08);
}

.blue-form-wrapper .el-input--suffix {
  color: black;
}

.button-black.el-button {
  color: white;
  background: #041820;
  border: 1px solid #041820;
  width: 100%;
  min-height: 40px;
}

.blue-form-wrapper .el-range-input {
  color: white;
  background: transparent;
}

.blue-form-wrapper .el-range-separator, .blue-form-wrapper .el-input__icon  .el-range__close-icon {
  color: white;
}

.blue-form-wrapper .el-range-input {
  width: 50% !important;
}
</style>
