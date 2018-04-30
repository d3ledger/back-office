<template>
  <el-container>
    <el-header>
      <div>
        <el-button plain round type="primary">New Settlement</el-button>
        <el-button plain round type="primary">New Transaction</el-button>
      </div>
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
  background: white;
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

a.router-link-exact-active {
  color: #409EFF;
}
</style>
