<template>
  <el-card>
    <div slot="header" class="header">
      <div>
        <h3 style="margin: 0">{{ title }}</h3>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" circle />
      </div>
    </div>
    <table>
      <tr>
        <th>Name</th>
        <th>Address</th>
      </tr>
      <tr v-for="wallet in wallets" :key="wallet.name">
        <td>{{ wallet.name }}({{ wallet.currency }})</td>
        <td>{{ wallet.address }}</td>
      </tr>
    </table>
  </el-card>
</template>

<script>
export default {
  name: 'wallets-card',
  props: {
    wallets: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

td, th{
  padding: 10px 30px 10px 0;
}

th {
  text-align: left;
  padding-top: 0;
}
</style>
