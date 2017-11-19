<!-- The root component for the LearningObjectTree and StudentParallel -->

<template>
  <div class="root">
    <learning-object-tree></learning-object-tree>
    <student-parallel></student-parallel>
  </div>
</template>


<script>
import StudentParallel from './StudentParallel';
import LearningObjectTree from './LearningObjectTree';

export default {
  name: "students",
  components: {
    StudentParallel,
    LearningObjectTree
  },
  data () {
    return {};
  }
}
</script>
