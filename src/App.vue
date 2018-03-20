<template>
  <main>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" @click.prevent="goRoot" href="">
        Study Plan
      </a>
      <a v-if="!isRoot" class="navbar-brand" @click.prevent="goBack" href="">
        <icon name="arrow-left"></icon>
      </a>
    </nav>
    <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </main>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      transitionName: "",
      isRoot: true
    }
  },
  methods: {
    ...mapActions(['fetchConcepts', 'fetchConceptMeans', 'fetchConceptEdges', 'fetchStudentScores']),
    goRoot() {
        this.$router.push('/')
    },
    goBack() {
        this.$router.go(-1)
    },
  },
  created () {
    if (this.$route.path !== '/')
      this.$router.push('/');

    // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
    [
      this.fetchConcepts(),
      this.fetchConceptMeans(),
      this.fetchConceptEdges(),
      this.fetchStudentScores()
    ];
  },
  watch: {
    '$route' (to, from) {
      // const toDepth = to.path.split('/').length
      // const fromDepth = from.path.split('/').length
      // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      this.isRoot = to.path == "/"
    }
  }
}
</script>

<style>
</style>
