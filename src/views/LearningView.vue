<template>
  <b-row>

    <b-col cols="2">
      <b-nav fill vertical>
        <b-nav-item v-for="concept in concepts" :key="concept">
          <router-link :to="`/learning/${concept}`" tag="li" active-class="active">
            <b-card>{{UpperName(concept)}}</b-card>
          </router-link>
        </b-nav-item>
      </b-nav>
    </b-col>

    <b-col cols="10">

      <h3>{{UpperName(concept)}}</h3>

      <b-row>
        <div class="mx-auto">
          <transition name="slide-fade">
            <router-view :key="$route.fullPath" name="videos"></router-view>
          </transition>
        </div>
      </b-row>
      <b-row>
        <div class="mx-auto">
          <router-view name="problems"></router-view>
        </div>
      </b-row>
    </b-col>

  </b-row>
</template>

<script>
  import ProblemView from "./ProblemView";
  import VideoView from "./VideoView";
  export default {
    name: "learning-view",
    props: ['concept'],
    components: {
      ProblemView, VideoView
    },
    data() {
      return {
        concepts: ["primitive_type", "variable", "array", "object_class", "instance_variable", "string", "operator", "branch", "loop", "method", "recursion", "nd_array"]
      }
    },
    methods: {
      UpperName(name)
      {
        let arr = name.split('_')
        let out = arr.map((word) => {
          return word[0].toUpperCase() + word.substring(1, word.length)
        })
        return out.join(' ')
      }
    }

  }
</script>

<style scoped>
  li {
    color: #1b1e21;
  }
  li:hover {
    background-color: #fafafa;
  }
  .active {
    color: #17dda9;
  }

  .slide-fade-enter-active {
    transition: all 1s ease;
  }
  /*.slide-fade-leave-active {*/
    /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  /*}*/
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>