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
import { mapActions } from 'vuex'

export default {
  name: 'app',
  methods: {
    ...mapActions([
      'fetchConcepts', 'fetchConceptMeans', 'fetchConceptEdges', 'fetchStudentScores'
    ]),
  },
  async created () {
      // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
    [
      await this.fetchConcepts(),
      await this.fetchConceptMeans(),
      await this.fetchConceptEdges(),
      await this.fetchStudentScores()
    ];
  }
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
