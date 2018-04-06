<template>
  <b-list-group-item :variant="variant" href="#" @click="clicked()">
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
      },
    },
    data() {
      return {
        variant: ""
      }
    },
    methods: {
      clicked()
      {
        this.$parent.$emit('clicked', this)
      },
      toggle() {
        if (this.variant === "info")
          this.variant = ""
        else
          this.variant = "info"
      }
    }
  }
</script>

<style scoped>
  /*.true {*/
    /*color: red;*/
  /*}*/
</style>