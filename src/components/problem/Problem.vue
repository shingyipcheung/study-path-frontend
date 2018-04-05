<template>
  <b-card>
    <slot></slot>
  </b-card>
</template>

<script>

  export default {
    name: "problem",
    props: {
      display_name: {
        type: String,
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
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  pre {
    font-family: 'Source Code Pro', monospace;
  }
</style>