<template>
  <b-card>
    <slot></slot>
    <b-btn :disabled="disable">Check</b-btn>
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
        disable: true
      }
    },
    mounted()
    {
      this.$on('clicked', (choice) => {
        // console.log(this.$children)
        this.disable = false
      })
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  pre {
    font-family: 'Source Code Pro', monospace;
  }
</style>