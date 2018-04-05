<template>
</template>

<script>
  import backend from '@/api/backend_axios'
  import Vue from 'vue'

  export default {
    name: "problem-item",
    props: ['problem_id'],
    data() {
      return {
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
          let res = Vue.compile(data);
          let { render, staticRenderFns } = res;
          new Vue({ 
            el: this.$el, 
            render, 
            staticRenderFns, 
            components: {
              'choice': () => import('./problem/Choice'),
              'choicegroup': () => import('./problem/ChoiceGroup'),
              'multiplechoiceresponse': () => import('./problem/MultipleChoiceResponse'),
              'problem': () => import('./problem/Problem'),
              'solution': () => import('./problem/Solution'),
            }
          })
        }
      },
    }
  }
</script>

<style scoped>
</style>