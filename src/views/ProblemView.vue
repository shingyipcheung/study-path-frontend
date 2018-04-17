<template>
  <!--hack!! key for recreation -->
  <div>
    {{index + 1}} / {{problems.length}}
    <problem-item :key="problem" :problem_id="problem"></problem-item>
  </div>
</template>

<script>
  import ProblemItem from "../components/ProblemItem";
  import backend from '@/api/backend_axios'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('learning_objects')

  export default {
    name: "problem-view",
    props: ['concept'],
    components: {
      ProblemItem,
    },
    data() {
      return {
        index: 0,
        problems: [],
        problem: null
      }
    },
    created() {
      this.fetchConcepts();
      this.fetchProblems(this.$route.params.concept);
    },
    mounted() {
      this.$on('next', () => {
        this.incrementProblem()
      })
    },
    methods: {
      ...mapActions(['fetchConcepts']),
      async fetchProblems(concept) {
        if (concept != null)
        {
          let { data } = await backend.getProblems(concept)
          this.problems = data
          this.problem = this.problems[this.index]
        }
      },
      incrementProblem()
      {
        this.index += 1
        if (this.index === this.problems.length) {
          let parent = this.$parent
          while (parent.$options.name !== 'learning-view')
              parent = parent.$parent
          parent.$emit('next_concept')
        }
        else {
          this.problem = this.problems[this.index]
        }
      }
    }
  }
</script>

<style scoped>
</style>