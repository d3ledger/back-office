<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
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
    showConnectionErrorMessage: debounce(function () {
      this.$message.error(`connection error: Please check IP address OR your internet connection`)
    }, 1000)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,700');

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.el-icon {
  font-family: element-icons !important;
}

[class^="el-"]:not(i):not([class*='el-icon']),
[class*="el-"]:not(i):not([class*='el-icon']) {
  font-family: 'IBM Plex Sans', sans-serif !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

.form-item-text {
  font-size: 14px;
  opacity: 0.7;
}

.form-item-text-amount {
  font-weight: bold;
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

.fullwidth {
  width: 100%;
}

.pointed {
  cursor: pointer;
}

/*
 * Input
 */

.withdraw_form .el-input__inner,
.exchange_form .el-input__inner,
.transfer_form .el-input__inner {
  background-color: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid #dcdfe6;
  font-weight: 700;
  height: 4.5rem;
  padding-left: 1.2rem;
  padding-top: 1.2rem;
  line-height: 0;
  font-size: 1rem;
}

.withdraw_form .el-input__inner:focus,
.exchange_form .el-input__inner:focus,
.transfer_form .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  color: rgba(0, 0, 0, 0.8);
  background-color: #ffffff;
  opacity: 1;
}

.withdraw_form .el-form-item,
.exchange_form .el-form-item,
.transfer_form .el-form-item {
  height: 4.4rem;
  margin-bottom: 32px;
}

.withdraw_form .el-form-item__label,
.exchange_form .el-form-item__label,
.transfer_form .el-form-item__label {
  line-height: 1;
  position: relative;
  top: 1.5rem;
  z-index: 10;
  margin-left: 1.2rem;
  font-size: 0.8rem;
  opacity: 0.56;
  color: rgba(0, 0, 0, 0.8);;
}

.withdraw_form .el-input--suffix input,
.exchange_form .el-input--suffix input,
.transfer_form .el-input--suffix input {
  padding-top: 0px;
}

.withdraw_form .el-input-group__append,
.exchange_form .el-input-group__append,
.transfer_form .el-input-group__append {
  background-color: #2d2d2d;
}

.withdraw_form .el-input-group__append input,
.exchange_form .el-input-group__append input,
.transfer_form .el-input-group__append input {
  font-weight: normal
}
/*
 * Login and SignUp pages
 */
.black-form_select-dropdown {
  background-color: #363636;
}

.black-form_select-dropdown .el-select-dropdown__item {
  background-color: #363636;
  color: #ffffff;
  opacity: 0.8;
}

.black-form_select-dropdown .el-select-dropdown__item:hover {
  background-color: #424242;
}
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-welcome {
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
}

.auth-form .el-input.is-disabled .el-input__inner {
  background-color: #363636;
  color: rgba(255, 255, 255, 0.8);
  border: solid 1px rgba(255, 255, 255, 0.4);
}

.auth-form .el-input__inner {
  background-color: #363636;
  color: rgba(255, 255, 255, 0.8);
  border: solid 1px rgba(255, 255, 255, 0.4);
  font-weight: 700;
  height: 4.5rem;
  padding-left: 1.2rem;
  padding-top: 1.2rem;
  line-height: 0;
  font-size: 1rem;
}

.auth-form .el-input__inner:focus {
  border-color: #ffffff;
  color: #ffffff;
  opacity: 1;
}

.auth-form .el-form-item {
  height: 4.4rem;
}

.auth-form .el-form-item__label {
  line-height: 1;
  position: relative;
  top: 2rem;
  z-index: 10;
  margin-left: 1.2rem;
  font-size: 0.8rem;
  opacity: 0.56;
  color: #ffffff;
}

.el-form-item__label::before {
  display: none !important;
}

.auth-form_upload .el-button,
.auth-form_upload .el-button:focus {
  width: 3.8rem;
  height: 4.5rem;
  border: solid 1px rgba(255, 255, 255, 0.4);
  background-color: #363636;
  color: rgba(255, 255, 255, 0.4);
  padding: 0;
  font-size: 1.2rem;
  border-radius: 0.3rem;
}

.auth-form_upload .el-button:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.auth-form_select .el-input__inner {
  height: 4.5rem !important;
}

.auth-button {
  margin-top: 1.5rem;
  height: 3.8rem;
  font-size: 0.8rem;
  background-color: #000000;
}

.auth-form-container {
  position: relative;
  width: 28rem;
  overflow: visible;
  margin-top: 3rem;
}

.auth_goto-container {
  margin-top: 4rem;
}

.auth_goto-container-title {
  margin-bottom: 1.2rem;
  font-size: 0.8rem;
  color: #ffffff;
  opacity: 0.8;
  text-align: center;
}

.auth_goto-container-button {
  height: 3.8rem;
  font-size: 0.8rem;
  border: solid 1px rgba(255, 255, 255, 0.4);
  background-color: #363636;
  margin-bottom: 1rem;
}

.auth_goto-container-button:hover {
  background-color: #363636;
  border-color: #ffffff;
  color: #ffffff;
}

</style>
