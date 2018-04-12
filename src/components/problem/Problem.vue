<template>
    <b-card>

      <b-alert :show="dismissCountDown"
               :variant="state.variant"
               @dismissed="dismissCountDown=0"
               @dismiss-count-down="countDownChanged">
        <icon :name="state.icon"></icon> {{state.msg}}
      </b-alert>

      <slot></slot>
      <hr>
      <b-btn v-b-modal.modalsm variant="link" v-if="state.showAns"
               style="color: #0ECB84">Ans</b-btn>
      <div style="float: right;">
        <b-btn :disabled="checkDisable" variant="outline-primary" @click="checked">
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

        dismissSecs: 1.5,
        dismissCountDown: 0,
        showDismissibleAlert: false,

        stateFalse: {
          icon: "times",
          msg: "Try again!",
          variant: "danger",
          check: "check-circle",
          text: "Check",
          showAns: false,
        },
        stateTrue: {
          icon: "check",
          msg: "Well done!",
          variant: "success",
          check: "arrow-alt-circle-right",
          text: "Next",
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
      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      },
      checked() {
        if (this.state.showAns)
        {
          // hack! emit to problem problem
          this.$parent.$parent.$emit('next')
        }
        else {
          this.state = (this.choice === "true") ? this.stateTrue: this.stateFalse
          this.showAlert()
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