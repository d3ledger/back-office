<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: #F9FBFF;
}

a {
  transition: opacity .15s ease-in-out;
  cursor: pointer;
}

a:hover {
  opacity: 0.8;
}
</style>
