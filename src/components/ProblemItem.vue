<template>
  <div class="mx-auto w-50">
    <!--<div ref="problem">-->

    <!--</div>-->
    <component :is="view"></component>
  </div>
</template>

<script>
  import backend from '@/api/backend_axios'
  import Vue from 'vue'

  export default {
    name: "problem-item",
                components: {
              'choice': require('./problem/Choice').default,
              'choicegroup': require('./problem/ChoiceGroup').default,
              'multiplechoiceresponse': require('./problem/MultipleChoiceResponse').default,
              'problem': require('./problem/Problem').default,
              'solution': require('./problem/Solution').default
                },

    props: ['problem_id'],
    data() {
      return {
        view: {}
      }
    },
    created() {
      this.getProblemHTML(this.problem_id);
    },
    updated() {
      // console.log(this.$el)
      // console.log(this.$refs["problem"])
      this.$nextTick(() => this.getProblemHTML(this.problem_id));
    },
    methods: {
      async getProblemHTML(problem_id) {
        if (problem_id != null)
        {
          let { data } = await backend.getProblemHTML(problem_id)
          // let res = Vue.compile(data);
          // let { render, staticRenderFns } = res;
          this.$set(this.view, 'template', data);
          console.log(this.view)
          // this.view = {
          //   template: data
          // }
          // new Vue({
          //   // el: this.$el,
          //   template: data,
          //   // render,
          //   // staticRenderFns,
          //   components: {
          //     'choice': () => import('./problem/Choice'),
          //     'choicegroup': () => import('./problem/ChoiceGroup'),
          //     'multiplechoiceresponse': () => import('./problem/MultipleChoiceResponse'),
          //     'problem': () => import('./problem/Problem'),
          //     'solution': () => import('./problem/Solution'),
          //   },
          //   // hack
          //   parent: this.$parent,
          // }).$mount(this.$refs["problem"])
        }
      },
    }
  }
</script>

<style scoped>
</style>