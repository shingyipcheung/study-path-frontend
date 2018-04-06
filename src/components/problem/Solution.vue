<template>

  <div>
    <!-- Using modifiers -->
    <b-btn v-b-modal.modalsm variant="link" size="sm" style="color: #0ECB84">Ans</b-btn>

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