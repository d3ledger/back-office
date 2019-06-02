<template>
  <el-row class="settings_item">
    <div class="settings_item-header">
      <span class="settings_item-header-title">
        {{ title }}
      </span>
    </div>
    <div>
      <slot />
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'SettingsItem',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Settings Item'
    }
  }
}
</script>

<style scope>
.settings_item {
  margin-bottom: 20px;
}
.settings_item-header {
  margin-bottom: 15px;
}

.settings_item-header-title {
  font-size: 1rem;
  font-weight: 300;
}
</style>
