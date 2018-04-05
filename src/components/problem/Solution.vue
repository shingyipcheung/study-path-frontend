<template>

  <div>
    <!-- Using modifiers -->
    <b-btn v-b-toggle.collapse variant="link" size="sm" style="color: #0ECB84">Ans</b-btn>

    <!-- element to collapse -->
    <b-collapse id="collapse">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>

  export default {
    name: "solution",
    props: {
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped>

</style>