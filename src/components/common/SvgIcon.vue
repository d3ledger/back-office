<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <svg
    :width="width"
    :height="height"
    :aria-labelledby="iconName"
    :class="iconClass"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    },
    iconClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
</style>
