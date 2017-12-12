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
            Student Grades of Learning Objects
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
            Filtered Students
          </div>
          <div class="card-block">
            <score-table></score-table>
          </div>
        </div>
      </div>


      <!--<div>-->
        <!--<b-embed type="video"-->
                 <!--aspect="16by9"-->
                 <!--src="http://w02.hkvu.hk/edX/COMP102x/download/COMP102x-L2-T2.1-Identifiers.mp4"-->
                 <!--allowfullscreen-->
        <!--&gt;</b-embed>-->
      <!--</div>-->

    </div>
  </div>
</template>


<script>
  import StudentParallel from './StudentParallel';
  import LearningObjectTree from './LearningObjectTree';
  import ScoreTable from "./ScoreTable";

  export default {
    name: "students",
    components: {
      ScoreTable,
      StudentParallel,
      LearningObjectTree,
    },
    data() {
      return {};
    }
  }
</script>

<style scoped>
  .card {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
