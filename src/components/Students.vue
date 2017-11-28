<!-- The root component for the LearningObjectTree and StudentParallel -->

<template>
  <div class="root">
    <div class="container">
      <div class="row">
        <div class="card">
          <div class="card-header">
            Learning Object Tree
          </div>
          <div class="card-block">
            <learning-object-tree></learning-object-tree>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="card">
          <div class="card-header">
            Student Grades on Learning Obejcts
          </div>
          <div class="card-block">
            <student-parallel></student-parallel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import StudentParallel from './StudentParallel';
import LearningObjectTree from './LearningObjectTree';

export default {
  name: "students",
  components: {
    StudentParallel,
    LearningObjectTree,
  },
  data () {
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
