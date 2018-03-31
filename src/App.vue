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
    <vue-progress-bar></vue-progress-bar>
  </main>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapActions } = createNamespacedHelpers('learning_objects')


export default {
  name: 'app',
  data() {
    return {
      transitionName: "",
      isRoot: true
    }
  },
  methods: {
    // ...mapActions(['fetchConcepts', 'fetchConceptMeans', 'fetchConceptEdges', 'fetchStudentScores']),

    goRoot() {
        this.$router.push('/')
    },
    goBack() {
        this.$router.go(-1)
    },
  },
  mounted() {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    // this.$Progress.finish()
  },
  created () {
    if (this.$route.path !== '/')
      this.$router.push('/');

    // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
    // Promise.all([
    //     this.fetchConcepts(),
    //     this.fetchConceptMeans(),
    //     this.fetchConceptEdges(),
    //     this.fetchStudentScores()
    // ])

    // //  [App.vue specific] When App.vue is first loaded start the progress bar
    // this.$Progress.start()
    // //  hook the progress bar to start before we move router-view
    // this.$router.beforeEach((to, from, next) => {
    //   //  does the page we want to go to have a meta.progress object
    //   if (to.meta.progress !== undefined) {
    //     let meta = to.meta.progress
    //     // parse meta tags
    //     this.$Progress.parseMeta(meta)
    //   }
    //   //  start the progress bar
    //   this.$Progress.start()
    //   //  continue to next page
    //   next()
    // })

    //  hook the progress bar to finish after we've finished moving router-view
    // this.$router.afterEach((to, from) => {
    //   //  finish the progress bar
    //   this.$Progress.finish()
    // });
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
