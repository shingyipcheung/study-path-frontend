<template>
  <b-list-group-item :class="correct" href="#">
    <slot></slot>
  </b-list-group-item>
</template>

<script>

  export default {
    name: "choice",
    props: {
      correct: {
        type: String,
        required: true,
        validator: value => {
          return value === "true" || value === "false"
        }
      }
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped>
  .true {
    color: red;
  }
</style>