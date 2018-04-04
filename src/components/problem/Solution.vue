<template>
  <h1>
    <slot></slot>
  </h1>
</template>

<script>

  export default {
    name: "solution",
    props: {
      correct: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped>

</style>