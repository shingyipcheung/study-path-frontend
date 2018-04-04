<template>
  <div>
      {{concept}}
    <problem-item problem_id="27a9876d7b714ae2b190e085857f4663"></problem-item>
  </div>
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