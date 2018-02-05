<template>
  <b-container>
    <b-alert :show="dismissCountDown"
             dismissible
             variant="info"
             @dismissed="dismissCountDown = 0"
             @dismiss-count-down="countDownChanged">
      <p>sending...</p>
      <b-progress variant="info"
                  :max="countDownSec"
                  :value="countDownSec - dismissCountDown"
                  height="4px">
      </b-progress>

    </b-alert>

    <b-alert variant="success" :show="completed" align="center">Complete!</b-alert>
    <b-btn class="mt-3"
           variant="info"
           v-if="dismissCountDown == 0 && !completed"
           block @click="dismissCountDown = countDownSec">Send the Suggested Study Path
    </b-btn>
  </b-container>
</template>

<script>
export default {
  name: 'CountDownAlert',
  props: {
    countDownSec: {
      type: Number,
      default: 3
    },
  },
  data () {
    return {
      completed: false,
      dismissCountDown: 0
    }
  },
  methods: {
    sent() {
      this.completed = true
      setTimeout(this.setCompleted, 2000)
    },
    setCompleted() {
      this.completed = false
      // this.$emit('completed')
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
      if (dismissCountDown == 0)
        this.sent()
    },
  }
}
</script>
