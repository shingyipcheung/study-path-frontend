<template>
  <b-container>

    <b-card title="Scores">
      <b-table v-if="table" small bordered hover :fields="fields" :items="table"></b-table>
    </b-card>

    <b-card title="Suggested Study Path" v-if="path && path.length">
      <span v-for="(node, index) in path">
        {{node}}
        <icon v-if="index !== path.length - 1" name="arrow-right" scale="0.8"></icon>
      </span>
      <count-down-alert></count-down-alert>
    </b-card>
    <!--<div>-->
      <!--<youtube video-id="jmuWCE5XxKA"></youtube>-->
    <!--</div>-->
  </b-container>
</template>

<script>
  import CountDownAlert from "../components/CountDownAlert";
  import backend from '@/api/backend_axios';

  export default {
    components: {CountDownAlert},
    name: "student-report",
    props: ['id'],
    data() {
      return {
        path: null,
        table: null,
        modalInfo: { title: '', content: '' },
        fields: [
          {key: "Learning Object", sortable:true},
          {key: "Score", sortable:true},
          {key: "Avg. Score", sortable:true},
        ],
      }
    },
    created() {
      this.fetchReport(this.id);
    },
    watch: {
      id() {
        this.fetchReport(this.id);
      }
    },
    methods: {
      async fetchReport(student_id) {
        if (student_id != null)
        {
          let { data } = await backend.getRecommendation(student_id)
          this.path = data.path
          this.table = data.table
        }
      },
      reset() {
        this.path = null
        this.table = null
      },
    }
  }
</script>

<style scoped>

</style>