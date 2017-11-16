<template>
<div id="root">
  <div id="example" class="parcoords"></div>
</div>
</template>

<script>
import * as d3 from 'd3';
import 'parcoord-es/dist/parcoords.css';
import ParCoords from 'parcoord-es';

export default {
  name: "StudentParallel",
  data () {
    return {
      students: [],
      learning_objects: [],
      total_points: [],
    }
  },
  mounted() {
    this.$http.get('http://127.0.0.1:8888/students/').then(res => {
      this.students = res.data.students;
      this.learning_objects = res.data.learning_objects;
      this.total_points = res.data.total_points;
      this.draw();
      //console.log(this.students);
    }, res => {
      console.error(res)
    })
  },
  methods: {
    draw() {
      var blue_to_brown = d3.scaleLinear()
        .domain(d3.extent(this.students, d => d['student_id']))
        .range(["green", "blue"]);

      var color = function(d) { return blue_to_brown(d['student_id']); };

      var chart = ParCoords()("#example");
      chart.data(this.students)
        .hideAxis(["student_id"])
        .color(color)
        .alpha(0.4)
        .render()
        .createAxes()
        .shadows()
        .reorderable()
        .brushMode("1D-axes");
    }
  },
}
</script>

<style>
#example {
  height: 450px;
  width: 700px;
}
#example.svg {
    transform-origin: 0 0 0px;
}
</style>
