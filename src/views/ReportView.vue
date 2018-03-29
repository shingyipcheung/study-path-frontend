<template>
  <b-container>

    <b-card title="Scores">
      <b-table v-if="table" small bordered hover :fields="fields" :items="table"></b-table>
    </b-card>

    <b-card title="Recommended Study Paths" v-if="paths && paths.length">
      <div v-for="path in paths">
        <span v-for="(node, index) in path">
          <span :class="{ pass: !failedObj.has(node) }">{{node}} </span>
        <icon v-if="index !== path.length - 1" name="arrow-right" scale="0.8"></icon>
      </span>
      </div>
      <count-down-alert></count-down-alert>
    </b-card>
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
        paths: null,
        table: null,
        failedObj: null,
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
          this.paths = data.paths
          this.table = data.table
          this.failedObj = new Set()
          this.table.map((row) => {
            if (row["_rowVariant"] === "danger")
              this.failedObj.add(row["Learning Object"])
          })
        }
      },
      reset() {
        this.paths = null
        this.table = null
      },
    }
  }
</script>

<style scoped>
  .pass {
    color: #c8c8c8;
  }
</style>