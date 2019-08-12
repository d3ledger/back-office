<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapState, mapActions } from 'vuex'

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

  created () {
    this.loadConfiguration()
  },

  methods: {
    ...mapActions([
      'loadConfiguration'
    ]),
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
  background: #000000;
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
  background: #000000;
  border: 1px solid #000000;
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
  line-height: 1rem;
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
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  background-color: #ffffff;
  margin-top: 6rem;
  border-radius: 0.8rem;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
}

.auth-header_logo {
  margin-top: 1rem;
}

.auth-header_title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #000000;
  margin: 1rem 0;
}

.auth-form .el-input.is-disabled .el-input__inner {
  background-color: #363636;
  color: rgba(255, 255, 255, 0.8);
  border: solid 1px rgba(255, 255, 255, 0.4);
}

.auth-form .el-input__inner {
  background: #f2f2f2;
  color: #000000;
  border: 1px solid #ebebeb;
  border-radius: 0.8rem;
  font-weight: 500;
  height: 4.2rem;
  padding-left: 1.2rem;
  padding-top: 1.2rem;
  line-height: 0;
  font-size: 1rem;
}

.auth-form .el-input__inner:focus {
  border: 1px solid #cdcdcd;
  color: #000000;
  opacity: 1;
}

.auth-form .el-input.is-focus .el-input__inner {
  border-color: #cdcdcd;
}

.auth-form .el-form-item:focus-within .el-form-item__label {
  opacity: 1;
}

.auth-form .el-form-item {
  margin-bottom: 0.9rem;
}

.auth-form .el-form-item__label {
  font-weight: 400;
  line-height: 1;
  position: absolute;
  z-index: 10;
  margin-top: 1rem;
  margin-left: 1.2rem;
  font-size: 0.9rem;
  color: #000000;
  opacity: 0.5;
}

.auth-form_upload-input .el-input__inner {
  padding-right: 4.5rem;
}

.auth-form_upload {
  position: absolute;
  top: 0;
  right: 0;
}

.auth-form_upload .el-button,
.auth-form_upload .el-button:focus {
  width: 3.5rem;
  height: 4.2rem;
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  padding: 0;
  font-size: 0.8rem;
  border-radius: 0.8rem;
  z-index: 10;
}

.el-form-item__label::before {
  display: none !important;
}

.auth-button {
  height: 3.8rem;
  font-size: 0.8rem;
  border-radius: 0.8rem;
  background-color: #000000;
}

.auth-button_actions {
  display: flex;
  justify-content: space-between;
}

.auth_button_actions-msg {
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.5;
}

.actions-msg_red-link {
  color: #d0021b;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8rem;
}

.auth-button_actions-button {
  margin-right: 1rem;
}

.auth-form-container {
  position: relative;
  width: 28rem;
  overflow: visible;
  margin-top: 1rem;
  padding: 0 1.2rem;
}

.el-icon-arrow-up::before {
  content: url('./assets/icons/shape.svg');
}

.black-form_select-dropdown {
  background-color: #ffffff;
  border-color: #000000;
  border-top: 0;
  border-radius: 0px 0px 0.5rem 0.5rem;
  z-index: 0 !important;
  margin-top: -0.6rem !important;
}

.black-form_select-dropdown .popper__arrow {
  display: none;
}

.black-form_select-dropdown .el-select-dropdown__item {
  background-color: #ffffff;
  color: #000000;
  border-bottom: 1px solid #e5e5e5;
  line-height: 3rem;
  height: 3rem;
}

.black-form_select-dropdown .el-select-dropdown__item.selected {
  font-weight: 500;
}

.black-form_select-dropdown .el-select-dropdown__item:hover {}

.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 1rem;
}
.border_success,
.border_success .el-input__inner,
.border_success .el-textarea__inner,
.border_success .el-button {
  border-color: #000000 !important;
}
.border_fail,
.border_fail .el-input__inner,
.border_fail .el-textarea__inner,
.border_fail .el-button {
  border-color: #d0021b !important;
}

.el-loading-mask.is-fullscreen
.el-loading-spinner
.circular circle {
  stroke: #f56c6c;
}

.approval_form-desc .key_representation {
  word-break: break-all;
}

.el-form-item__error {
  color: #d0021b;
  padding: 0.7rem 0;
  position: relative !important;
  font-size: 0.9rem;
}
</style>
