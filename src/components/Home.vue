<template>
  <el-container>
    <el-header>
      <router-link to="/">Balance</router-link>
      <router-link to="/settlements">Settlements</router-link>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background: #ddd;
  display: flex;
  align-items: center;
}

a {
  margin-right: 1rem;
  text-decoration: none;
  font-weight: bold;

  &:active {
    color: black;
    text-decoration: none;
  }

  &:visited {
    color: black;
  }
}

.router-link-active {
  color: blue;
}
</style>
