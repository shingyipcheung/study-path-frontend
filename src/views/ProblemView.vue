<template>
  <b-container>
    <b-row>
      <problem-item :problem_id="problem"></problem-item>
    </b-row>
    <!--<b-row>-->
      <!--<problem-item v-for="problem_id in problems" :problem_id="problem_id" :key="problem_id"></problem-item>-->
    <!--</b-row>-->
  </b-container>
</template>

<script>
  import ProblemItem from "../components/ProblemItem";
  export default {
    name: "problem-view",
    props: ['concept'],
    components: {
      ProblemItem,
    },
    data() {
      return {
        index: 0,
        problems: [
          "d1dfc14002cc41aab7a6cb31c3b6aa18",
          "b45eb7410f12464ca3ba317d3fe46090",
          "dc8191c3ed124824a3003efd938da298"
        ],
        problem: null
      }
    },
    created() {
      this.problem = this.problems[this.index]
    },
    mounted() {
      this.$on('next', () => {
        this.incrementProblem()
      })
    },
    methods: {
      incrementProblem()
      {
        this.index += 1
        this.problem = this.problems[this.index]
        console.log(this.problem)
      }
    }
  }
</script>

<style scoped>
</style>