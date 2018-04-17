<template>
    <b-card>
      <slot></slot>
      <hr>
      <!--see id=modalsm in solution.vue-->
      <b-btn v-b-modal.modalsm variant="link" v-if="state.showAns"
         style="color: #0ECB84">Ans</b-btn>

      <div style="float: right;">
        <b-btn :disabled="checkDisable" :variant="state.next" @click="checked">
          <icon :name="state.check">
          </icon> {{state.text}}
        </b-btn>
      </div>
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
        checkDisable: true,

        stateFalse: {
          options: {
            title: "×",
            msg: "Try again!",
          },
          check: "check-circle",
          text: "Check",
          next: "outline-primary",
          showAns: false,
        },
        stateTrue: {
          options: {
            title: '✔',
            msg: "Well done! \n check the answer to see explanation",
          },
          check: "arrow-alt-circle-right",
          text: "Next",
          next: "outline-success",
          showAns: true
        },
        state: null,
        choice: null,
      }
    },
    created() {
      this.state = this.stateFalse;
    },
    methods: {
      checked() {
        if (this.state.showAns)
        {
          // hack! emit to problem view
          this.$parent.$parent.$emit('next')
        }
        else {
          if (this.choice === "true") {
             this.state = this.stateTrue
             this.$toast.success(this.state.options.msg, this.state.options.title, {
               icon: '',
               titleSize: 20,
               timeout: 2000
             })
          }
          else
          {
            this.state = this.stateFalse
            this.$toast.error(this.state.options.msg, this.state.options.title, {
              icon: '',
              titleSize: 20,
              timeout: 2000
            })
          }
        }
      }
    },
    mounted()
    {
      this.$on('clicked', (choice) => {
        this.checkDisable = false
        this.choice = choice
      })
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  pre {
    font-family: 'Source Code Pro', monospace;
  }

  .fa-icon {
    width: auto;
    height: 1em; /* or any other relative font sizes */
    position: relative;
    top: 3px;
    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }
</style>