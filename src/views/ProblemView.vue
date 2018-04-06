<template>
  <b-container>
    <b-row>
      <problem-item problem_id="d1dfc14002cc41aab7a6cb31c3b6aa18"></problem-item>
      <problem-item problem_id="b45eb7410f12464ca3ba317d3fe46090"></problem-item>
      <problem-item problem_id="dc8191c3ed124824a3003efd938da298"></problem-item>
    </b-row>
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
  }
</script>

<style scoped>
</style>