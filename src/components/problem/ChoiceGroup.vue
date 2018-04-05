<template>
  <b-list-group>
    <slot></slot>
  </b-list-group>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "choicegroup",
    props: {
      type: {
        type: String,
        required: true
      }
    },
    data() {
      return {

      }
    },
    mounted() 
    {
      const choices = _.filter(this.$slots.default, 'componentInstance')
      console.log(choices)
    }
  }
</script>

<style>
 @import url('https://fonts.googleapis.com/css?family=Hi+Melody');
  .list-group {
    list-style-type: none;
    margin-left: 2em;
    counter-reset: item
  }

  .list-group-item {
    position: relative;
    margin-bottom: 10px;
  }

  .list-group-item::before {
    counter-increment: item;
    content: counter(item, upper-alpha);

    position: absolute;
    left: -0.95em;
    bottom: 3px;
    font-family: 'Hi Melody', cursive;
    font-size: 2em;
    /* font-weight: bold; */
    width: 100%;
    height: 100%;
/*      
    transform: rotate(-25deg);
    -ms-transform: rotate(-25deg);
    -webkit-transform: rotate(-25deg); */
  }
</style>