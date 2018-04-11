<template>

  <div>
    <!-- Using modifiers -->

    <!-- element to collapse -->
    <!--<b-collapse id="collapse">-->
      <!--<b-card>-->
        <!--<slot></slot>-->
      <!--</b-card>-->
    <!--</b-collapse>-->

    <b-modal id="modalsm" size="md" centered hide-footer title="Solution">
      <slot></slot>
    </b-modal>
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