<!-- adapted from https://bl.ocks.org/syntagmatic/05a5b0897a48890133beb59c815bd953 -->

<template>
<div class="student-parallel">
  <div id="graph"></div>
  <div id="student-details" class="student-details">
    <div>
      <icon name="list-ol"></icon>
      <span> Total students selected: </span>
      <b-badge pill variant="light">{{selected_students.length}}</b-badge>
    </div>

    <div>
      <b-table hover striped small :per-page="rows_per_page"
      :items="selected_students" :fields="fields" :current-page="current_page">
      </b-table>
      <b-pagination size="md" align="center"
      :total-rows="selected_students.length"
      v-model="current_page" :per-page="rows_per_page">
      </b-pagination>
      <!-- <div v-for="student in selected_students" class="student">
        <p>
          ID: {{student.student_id}}
          <span v-for="key in dimensions">
            {{key.key}}:
            {{student[key.key] ? student[key.key] : 0}}
          </span>
        </p>
      </div> -->
    </div>
  </div>
</div>
</template>

<script>
import * as d3 from 'd3';
// import the dependency
import renderQueue from '../assets/js/render_queue.js';

export default {
  name: "student-parallel",
  data () {
    return {
      students: [],
      learning_objects: [],
      total_points: [],
      selected_students: [],
      dimensions: [
        "primitive_type",
        "variable",
        "operator",
        "array",
        "nd_array",
        "string",
        "branch",
        "loop",
        "object_class",
        "instance_variable",
        "method",
        "recursion"
      ],
      // data required for the table and pagination
      fields: [
        {key:"student_id", sortable:true},
        {key:"primitive_type", sortable:true},
        {key:"variable", sortable:true},
        {key:"operator", sortable:true},
        {key:"array", sortable:true},
        {key:"nd_array", sortable:true},
        {key:"string", sortable:true},
        {key:"branch", sortable:true},
        {key:"loop", sortable:true},
        {key:"object_class", sortable:true},
        {key:"instance_variable", sortable:true},
        {key:"method", sortable:true},
        {key:"recursion", sortable:true},
      ],
      current_page: 1, rows_per_page: 10
    }
  },
  mounted() {
    this.$http.get('http://127.0.0.1:8000/study_plan/concept_score/all/').then(res => {
      this.students = res.data;
      // cut the extra numbers on the right of floating point
      this.students.forEach(d => {
        for (const key of Object.keys(d)) {
          if (key != "student_id") {
            d[key] = d[key].toFixed(2);
          }
        }
      })
      // set the default selection to all students
      this.selected_students = this.students;
      // console.log(this.students);
      this.start_draw();
      //console.log(this.students);
    }, res => {
      console.error(res)
    })
  },
  // watch: {
  //   selected_students: function(newVal, oldVal) {
  //     console.log(newVal);
  //   }
  // },
  methods: {
    start_draw() {
      // get graph DOM to set width later
      var that = this;
      let el = d3.select(this.$el);
      var graph = el.select("#graph").node();
          // console.log(graph.getBoundingClientRect().width);

      var margin = {top: 66, right: 50, bottom: 20, left: 50},
          width = graph.getBoundingClientRect().width - margin.left - margin.right,
          height = 340 - margin.top - margin.bottom,
          innerHeight = height - 2;

      var devicePixelRatio = window.devicePixelRatio || 1;

      var color = d3.scaleOrdinal()
        .range(["#5DA5B3"]);

      // only the Number will be used
      var types = {
            "Number": {
              key: "Number",
              coerce: function(d) { return +d; },
              extent: d3.extent,
              within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
              defaultScale: d3.scaleLinear().range([innerHeight, 0])
            },
            "String": {
              key: "String",
              coerce: String,
              extent: function (data) { return data.sort(); },
              within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
              defaultScale: d3.scalePoint().range([0, innerHeight])
            },
            "Date": {
              key: "Date",
              coerce: function(d) { return new Date(d); },
              extent: d3.extent,
              within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
              defaultScale: d3.scaleTime().range([0, innerHeight])
            }
          };


      // get dimensions from data.
      // var dimensions = d3.keys(this.students[0]).filter(d => {
      //   // ignore the student_id
      //   if (d == "student_id") {
      //     return false;
      //   }else {
      //     return true;
      //   }
      // })

      // self define a reasonable order for dimensions first
      var dimensions = this.dimensions;


        // set to required dimension form.
      for (var i = 0; i < dimensions.length; i ++) {
        var d = dimensions[i];
        dimensions[i] = {
          key: d,
          type: types["Number"],
          scale: d3.scaleLinear().range([innerHeight, 0])
        };
      }

      // copied from the original graph design
      var xscale = d3.scalePoint()
          .domain(d3.range(dimensions.length))
          .range([0, width]);

      var yAxis = d3.axisLeft();

      var container = el.select("#graph").append("div")
          .attr("class", "parcoords")
          .style("width", width + margin.left + margin.right + "px")
          .style("height", height + margin.top + margin.bottom + "px");

      var svg = container.append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var canvas = container.append("canvas")
          .attr("width", width * devicePixelRatio)
          .attr("height", height * devicePixelRatio)
          .style("width", width + "px")
          .style("height", height + "px")
          .style("margin-top", margin.top + "px")
          .style("margin-left", margin.left + "px");

      var ctx = canvas.node().getContext("2d");
      ctx.globalCompositeOperation = 'darken';
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1.5;
      ctx.scale(devicePixelRatio, devicePixelRatio);

      // var output = el.select("#graph").append("pre");

      var axes = svg.selectAll(".axis")
          .data(dimensions)
        .enter().append("g")
          .attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })
          .attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });

      // define the students data
      var data = this.students;

      // set scale domain;
      dimensions.forEach(d => {
        // console.log(data);
        // console.log(d.key);
        // console.log(d3.extent(data, p => p[d.key]));
        d.scale.domain(d3.extent(data, p => p[d.key]));
      })

      data.forEach(function(d) {
        dimensions.forEach(function(p) {
          d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
        });

        // truncate long text strings to fit in data table
        for (var key in d) {
          if (d[key] && d[key].length > 35) d[key] = d[key].slice(0,36);
        }
      });

      var render = renderQueue(draw).rate(50);

      ctx.clearRect(0,0,width,height);
      ctx.globalAlpha = d3.min([0.85/Math.pow(data.length,0.3),1]);
      render(data);

      axes.append("g")
          .each(function(d) {
            var renderAxis = "axis" in d
              ? d.axis.scale(d.scale)  // custom axis
              : yAxis.scale(d.scale);  // default axis
            d3.select(this).call(renderAxis);
          })
        .append("text")
          .attr("class", "title")
          .attr("text-anchor", "start")
          .text(function(d) { return "description" in d ? d.description : d.key; });

      // Add and store a brush for each axis.
      axes.append("g")
          .attr("class", "brush")
          .each(function(d) {
            d3.select(this).call(d.brush = d3.brushY()
              .extent([[-10,0], [10,height]])
              .on("start", brushstart)
              .on("brush", brush)
              .on("end", brush)
            )
          })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

      // show the food group name, not used in our case.
      // el.selectAll(".axis.food_group .tick text")
      //   .style("fill", color);

      // output.text(d3.tsvFormat(data.slice(0,24)));

      // END OF THE MAIN FUNCTION TO DRAW
      // the following are the helper functions

      function project(d) {
        return dimensions.map(function(p,i) {
          // check if data element has property and contains a value
          if (
            !(p.key in d) ||
            d[p.key] === null
          ) return null;

          return [xscale(i),p.scale(d[p.key])];
        });
      };

      function draw(d) {
        ctx.strokeStyle = color(d.food_group);
        ctx.beginPath();
        var coords = project(d);
        coords.forEach(function(p,i) {
          // this tricky bit avoids rendering null values as 0
          if (p === null) {
            // this bit renders horizontal lines on the previous/next
            // dimensions, so that sandwiched null values are visible
            if (i > 0) {
              var prev = coords[i-1];
              if (prev !== null) {
                ctx.moveTo(prev[0],prev[1]);
                ctx.lineTo(prev[0]+6,prev[1]);
              }
            }
            if (i < coords.length-1) {
              var next = coords[i+1];
              if (next !== null) {
                ctx.moveTo(next[0]-6,next[1]);
              }
            }
            return;
          }

          if (i == 0) {
            ctx.moveTo(p[0],p[1]);
            return;
          }

          ctx.lineTo(p[0],p[1]);
        });
        ctx.stroke();
      }

      function brushstart() {
        d3.event.sourceEvent.stopPropagation();
      }

      // Handles a brush event, toggling the display of foreground lines.
      function brush() {
        render.invalidate();

        var actives = [];
        svg.selectAll(".axis .brush")
          .filter(function(d) {
            return d3.brushSelection(this);
          })
          .each(function(d) {
            actives.push({
              dimension: d,
              extent: d3.brushSelection(this)
            });
          });

        var selected = data.filter(function(d) {
          if (actives.every(function(active) {
              var dim = active.dimension;
              // test if point is within extents for each active brush
              return dim.type.within(d[dim.key], active.extent, dim);
            })) {
            return true;
          }
        });

        // show ticks for active brush dimensions
        // and filter ticks to only those within brush extents
        /*
        svg.selectAll(".axis")
            .filter(function(d) {
              return actives.indexOf(d) > -1 ? true : false;
            })
            .classed("active", true)
            .each(function(dimension, i) {
              var extent = extents[i];
              d3.select(this)
                .selectAll(".tick text")
                .style("display", function(d) {
                  var value = dimension.type.coerce(d);
                  return dimension.type.within(value, extent, dimension) ? null : "none";
                });
            });

        // reset dimensions without active brushes
        svg.selectAll(".axis")
            .filter(function(d) {
              return actives.indexOf(d) > -1 ? false : true;
            })
            .classed("active", false)
            .selectAll(".tick text")
              .style("display", null);
        */

        ctx.clearRect(0,0,width,height);
        ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
        render(selected);
        that.selected_students = selected;
        // console.log(this.selected_students);
        // output.text(d3.tsvFormat(selected.slice(0,24)));
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#student-parallel {
  width: 100%;
}

#student-details {
  width: 100%;
  height: 600px;
  /*margin: 6px 12px;
  tab-size: 40;
  font-size: 10px;*/
  overflow: hidden;
  .overflow-static {
    height: 50px;
  }
  .overflow_dynamic {
    height: 250px;
    overflow: auto;
  }
}

.student {
  margin-left: 40px;
  p span {
    font-size: 0.7rem;
  }
}
</style>

<style lang="scss">
.parcoords {
  display: block;
  svg {
    font: 10px sans-serif;
    position: absolute;
  }
  canvas {
    font: 10px sans-serif;
    position: absolute;
    opacity: 0.9;
    pointer-events: none;
  }
}

.axis {
  .title {
    font-size: 15px;
    transform: rotate(-21deg) translate(-5px, -6px);
    fill: #222;
  }
  line, path {
    fill: none;
    stroke: #ccc;
    stroke-width: 1px;
  }
  .tick text {
    fill: #222;
    opacity: 0;
    pointer-events: none;
  }
  &.manufac_name .tick text, &.food_group .tick text {
    opacity: 1;
  }
  &:hover {
    line, path {
      fill: none;
      stroke: #222;
      stroke-width: 1px;
    }
  }
  &.active {
    line, path {
      fill: none;
      stroke: #222;
      stroke-width: 1px;
    }
  }
  &:hover {
    .title {
      font-weight: bold;
    }
    .tick text {
      opacity: 1;
    }
  }
  &.active {
    .title {
      font-weight: bold;
    }
    .tick text {
      opacity: 1;
      font-weight: bold;
    }
  }
}

.brush .extent {
  fill-opacity: .3;
  stroke: #fff;
  stroke-width: 1px;
}
</style>
