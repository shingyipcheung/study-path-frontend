<template>
  <div v-html="html">
  </div>
</template>

<script>
  import backend from '@/api/backend_axios'

  export default {
    name: "problem-item",
    props: ['problem_id'],
    components: {
      'solution': () => import('./problem/Solution')
    },
    data() {
      return {
        html: ""
      }
    },
    created() {
      this.getProblemHTML(this.problem_id);
    },
    methods: {
      async getProblemHTML(problem_id) {
        if (problem_id != null)
        {
          let { data } = await backend.getProblemHTML(problem_id)
          this.html = data
        }
      },
    }
  }
</script>

<style scoped>

</style>