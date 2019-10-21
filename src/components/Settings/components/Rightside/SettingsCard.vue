<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <span>
    <el-card
      :body-style="{ padding: '0' }"
      class="settings-card"
    >
      <div class="header_btn">
        <slot name="header" />
      </div>
      <slot name="content" />
    </el-card>
  </span>
</template>

<script>
export default {
  name: 'SettingsCard'
}
</script>

<style>
.settings-card {
  margin-bottom: 0.5rem;
}
.header_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}
.header_btn-title {
  font-weight: 300;
  height: 2rem;
  line-height: 2rem;
}
.header_btn-icon_block {
  cursor: pointer;
}
.header_btn-icon {
  width: 1rem !important;
  margin-right: 1rem;
  color: #bbbbbb;
}
.header_only {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.action_button {
  border: 1px solid #000000;
  text-transform: uppercase;
  width: 5rem;
  padding: 0.5rem;
}
.action_button:active,
.action_button:focus,
.action_button:hover {
  background-color: #ffffff;
  border: 1px solid #000000;
  color: #000000;
}
.action_button-icon {
  font-size: 0.7rem;
  height: 0.8rem;
  margin-left: -0.2rem;
  margin-right: 0.3rem;
}
.action_button.content_width {
  width: fit-content
}

.settings-item {
  max-height: 20rem;
  overflow-y: scroll;
}
.settings-item_row {
  padding: 0 1.5rem;
  height: 3.05rem;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #efefef;
}
.settings-item_row:hover {
  background-color: #f7f7f7;
}
.settings-item_row-key {
  font-size: 0.8rem;
  line-height: 3rem;
}
.settings-item_row-key-item {
  margin-right: 1rem;
}
.settings-item_row div {
  display: flex;
  justify-content: center;
}

.settings-item_row-delete {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: 0.8rem;
}
.settings-item_row-delete:active,
.settings-item_row-delete:focus,
.settings-item_row-delete:hover {
  background-color: transparent;
  color: #000000;
}
.el-input-number__decrease, .el-input-number__increase {
  padding: 1rem;
  bottom: 1px;
}
.el-input-number .el-input__inner {
  padding: 0;
}
.pending {
  margin-right: 20px
}
.approval_form-desc {
  text-align: center;
}
</style>
