<!-- adapted from https://bl.ocks.org/syntagmatic/05a5b0897a48890133beb59c815bd953 -->

<template>
  <div class="student-parallel" ref="graph">
  </div>
</template>

<script>
  import * as d3 from 'd3';
  d3.tip = require("d3-tip");
  // import the dependency
  import renderQueue from '../assets/js/render_queue.js';
  import { createNamespacedHelpers } from 'vuex'
  const { mapGetters, mapMutations } = createNamespacedHelpers('learning_objects')

  import _ from 'lodash';
  import backend from '@/api/backend_axios'

  export default {
    name: "student-parallel",
    data() {
      return {
        render_speed: 10,
        oldWidth: null
      }
    },
    computed: {
      ...mapGetters({
        concepts: 'allConcepts',
        concept_means: 'allMeans',
        student_concept_scores: 'allStudentScores',
      }),
      dimensions() {
        return _.cloneDeep(this.concepts);
      },
      students() {
        return _.cloneDeep(this.student_concept_scores);
      }
    },
    created() {
      this.watchCollection(['dimensions', 'students'], this.render);
    },
    mounted() {
      window.addEventListener('resize', this.render);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.render);
    },
    activated() {
      window.addEventListener('resize', this.render);
      if (this.$refs.graph.clientWidth !== this.oldWidth)
        this.render()
    },
    deactivated() {
      window.removeEventListener('resize', this.render);
    },
    methods: {
      ...mapMutations({
        setFilteredStudents: 'SET_FILTERED_STUDENTS'
      }),
      render: _.debounce(function() {
        if (this.students.length === 0 || this.dimensions.length === 0)
          return;
        // reset all filtered students
        this.setFilteredStudents(this.students);
        // get graph DOM to set width later
        let that = this;
        let graph = d3.select(this.$refs.graph);
        // https://stackoverflow.com/questions/14422198/
        // remove all SVG element
        d3.select(".d3-tip").remove();
        graph.selectAll("*").remove();
        this.oldWidth = this.$refs.graph.clientWidth
        let margin = {top: 66, right: 50, bottom: 20, left: 50},
          width = this.$refs.graph.clientWidth - margin.left - margin.right,
          height = 340 - margin.top - margin.bottom,
          innerHeight = height - 2;
        // let color = d3.scaleOrdinal()
        //   .range(["#5cd6ff"]);

        // only the Number will be used
        let types = {
          "Number": {
            key: "Number",
            coerce: function (d) {
              return +d;
            },
            extent: d3.extent,
            within: function (d, extent, dim) {
              return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
            },
            defaultScale: d3.scaleLinear().range([innerHeight, 0])
          },
          // "String": {
          //   key: "String",
          //   coerce: String,
          //   extent: function (data) {
          //     return data.sort();
          //   },
          //   within: function (d, extent, dim) {
          //     return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
          //   },
          //   defaultScale: d3.scalePoint().range([0, innerHeight])
          // },
          // "Date": {
          //   key: "Date",
          //   coerce: function (d) {
          //     return new Date(d);
          //   },
          //   extent: d3.extent,
          //   within: function (d, extent, dim) {
          //     return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
          //   },
          //   defaultScale: d3.scaleTime().range([0, innerHeight])
          // }
        };

        // self define a reasonable order for dimensions first
        let dimensions = this.dimensions;
        // set to required dimension form.
        for (let i = 0; i < dimensions.length; i++) {
          let d = dimensions[i];
          if (d.key === undefined)
          {
            dimensions[i] = {
              key: d,
              type: types["Number"],
              scale: d3.scaleLinear().range([innerHeight, 0])
            };
          }
        }

        // copied from the original graph design
        let xscale = d3.scalePoint()
          .domain(d3.range(dimensions.length))
          .range([0, width]);

        let yAxis = d3.axisLeft();

        let container = graph.append("div")
          .attr("class", "parcoords")
          .style("width", width + margin.left + margin.right + "px")
          .style("height", height + margin.top + margin.bottom + "px");

        let svg = container.append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let devicePixelRatio = window.devicePixelRatio || 1;
        let canvas = container.append("canvas")
          .attr("width", width * devicePixelRatio)
          .attr("height", height * devicePixelRatio)
          .style("width", width + "px")
          .style("height", height + "px")
          .style("margin-top", margin.top + "px")
          .style("margin-left", margin.left + "px");

        let ctx = canvas.node().getContext("2d");
        ctx.globalCompositeOperation = 'darken';
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1.5;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.strokeStyle = "#5cd6ff";

        let tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            let mean = that.concept_means[d.key]
            return "<strong>Avg. score: </strong> <span style='color:greenyellow'>" + mean + "</span>";
          })
          .direction('w')
          .offset(function(d) {
            return [d.scale(that.concept_means[d.key] + 0.5) - 2, 0]
          })

        svg.call(tip);

        let axes = svg.selectAll(".axis").remove()
          .data(dimensions)
          .enter().append("g")
          .attr("class", function (d) {
            return "axis " + d.key.replace(/ /g, "_");
          })
          .attr("transform", function (d, i) {
            return "translate(" + xscale(i) + ")";
          })

        // define the students data
        let data = this.students;

        // set scale domain;
        dimensions.forEach(d => {
          d.scale.domain(d3.extent(data, p => p[d.key]));
        })

        // preprocessing
        data.forEach(function (d) {
          // < 0 will be converted to null
          // dimensions.forEach(function (p) {
          //   d[p.key] = (d[p.key] < 0) ? null : p.type.coerce(d[p.key]);
          // });

          // truncate long text strings to fit in data table
          for (let key in d) {
            if (d[key] && d[key].length > 35) d[key] = d[key].slice(0, 36);
          }
        });

        let project = function(d) {
          return dimensions.map(function (p, i) {
            // check if data element has property and contains a value
            if (!(p.key in d) || d[p.key] === null)
              return null;
            return [xscale(i), p.scale(d[p.key])];
          });
        };

        function draw(d) {
          ctx.beginPath();
          let coords = project(d);
          coords.forEach(function (p, i) {
            // this tricky bit avoids rendering null values as 0
            if (p === null) {
              // this bit renders horizontal lines on the previous/next
              // dimensions, so that sandwiched null values are visible
              if (i > 0) {
                let prev = coords[i - 1];
                if (prev !== null) {
                  ctx.moveTo(prev[0], prev[1]);
                  ctx.lineTo(prev[0] + 6, prev[1]);
                }
              }
              if (i < coords.length - 1) {
                let next = coords[i + 1];
                if (next !== null) {
                  ctx.moveTo(next[0] - 6, next[1]);
                }
              }
              return;
            }

            if (i == 0) {
              ctx.moveTo(p[0], p[1]);
              return;
            }

            ctx.lineTo(p[0], p[1]);
          });
          ctx.stroke();
        }

        let render_queue = renderQueue(draw).rate(this.render_speed);

        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = d3.min([0.85 / Math.pow(data.length, 0.3), 1]);
        render_queue(data);

        axes.append("g")
          .each(function (d) {
            let renderAxis = "axis" in d
              ? d.axis.scale(d.scale)  // custom axis
              : yAxis.scale(d.scale);  // default axis
            d3.select(this).call(renderAxis);
          })
          .append("text")
          .attr("class", "title")
          .attr("text-anchor", "start")
          .text(function (d) {
            return d.key;
          });

        // Add and store a brush for each axis.
        axes.append("g")
          .attr("class", "brush")
          .each(function (d) {
            d3.select(this).call(d.brush = d3.brushY()
              .extent([[-10, 0], [10, height]])
              .on("start", brushstart)
              .on("brush", brush)
              .on("end", brush)
            )
          })
          .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16)
          .on('mouseover', function(d) {
            if (d.type === 'overlay')
              tip.show(d3.select(this.parentNode).datum())
          })
          .on('mouseout', tip.hide)

        function brushstart() {
          d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
          render_queue.invalidate();

          let actives = [];
          svg.selectAll(".axis .brush")
            .filter(function (d) {
              return d3.brushSelection(this);
            })
            .each(function (d) {
              actives.push({
                dimension: d,
                extent: d3.brushSelection(this)
              });
            });

          let filtered = data.filter(function (d) {
            if (actives.every(function (active) {
                let dim = active.dimension;
                // test if point is within extents for each active brush
                return dim.type.within(d[dim.key], active.extent, dim);
              })) {
              return true;
            }
          });

          ctx.clearRect(0, 0, width, height);
          ctx.globalAlpha = d3.min([0.85 / Math.pow(filtered.length, 0.3), 1]);
          render_queue(filtered);
          that.setFilteredStudents(filtered);
        }
      }, 500)
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
      font-size: 13px;
      transform: rotate(-21deg) translate(-5px, -6px);
      fill: #222;
    }
    line, path {
      fill: none;
      stroke: #ccc;
      stroke-width: 1.5px;
    }
    .tick text {
      fill: #222;
      opacity: 0;
      pointer-events: none;
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

  .d3-tip {
    line-height: 1;
    font-size: 10px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 2px;
    pointer-events: none;

    /* Creates a small triangle extender for the tooltip */
    &:after {
      box-sizing: border-box;
      display: inline;
      font-size: 10px;
      width: 100%;
      line-height: 1;
      color: rgba(0, 0, 0, 0.5);
      position: absolute;
      pointer-events: none;
    }

    /* Westward tooltips */
    &.w:after {
      content: "\25B6";
      margin: -4px 0 0 0;
      top: 50%;
      left: 100%;
    }
  }
</style>
