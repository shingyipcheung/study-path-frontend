<template>
  <main>
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="">
        Study Plan
      </a>
    </nav>
    <div>
      <router-view/>
    </div>
  </main>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
