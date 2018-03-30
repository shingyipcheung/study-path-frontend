<!-- The root component for the LearningObjectTree and StudentParallel -->

<template>
  <div class="root">
    <div class="container">

      <div class="row">
        <div class="card">
          <div class="card-header">
            <icon name="question-circle"></icon>
            Learning Object Dependency Graph
          </div>
          <div class="card-block">
            <learning-object-tree></learning-object-tree>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="card">
          <div class="card-header">
            <icon name="filter"></icon>
            Learning Object Performance of Students
          </div>
          <div class="card-block">
            <student-parallel></student-parallel>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="card">
          <div class="card-header">
            <icon name="list-ol"></icon>
            Selected Students
          </div>
          <div class="card-block">
            <score-table></score-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import StudentParallel from '../components/StudentParallel';
  import LearningObjectTree from '../components/LearningObjectTree';
  import ScoreTable from "../components/ScoreTable";
  import { mapActions } from 'vuex'

  export default {
    name: "students",
    components: {
      ScoreTable,
      StudentParallel,
      LearningObjectTree,
    },
    data() {
      return {};
    },
    methods: {
      ...mapActions(['fetchConcepts', 'fetchConceptMeans', 'fetchConceptEdges', 'fetchStudentScores']),
    },
    created() {
      // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
      Promise.all([
          this.fetchConcepts(),
          this.fetchConceptMeans(),
          this.fetchConceptEdges(),
          this.fetchStudentScores()
      ])
    },
  }
</script>

<style scoped>
  .card {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
