<template>
  <div id="root">
    <svg></svg>
  </div>
</template>

<script>
  // http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
  import * as d3 from 'd3';
  import "d3-selection-multi";
  import _ from 'lodash';

  import { mapState } from 'vuex'

  export default {
    name: "learning-object-tree",
    data() {
      return {
        //      width: 1100,
        nodes: [],
        links: [],
        height: 300,
      }
    },
    computed: {
      ...mapState({
        concepts:  state => state.learning_objects.concepts,
        edges: state => state.learning_objects.concept_edges,
      }),
    },
    mounted() {
      this.start_draw();
    },
    watch: {
      // https://forum-archive.vuejs.org/topic/5194/advice-on-separating-d3-and-vue-vuex-data/3
      edges()
      {
        this.start_draw();
      }
    },
    methods: {
      // main entry for the drawing function
      start_draw() {
        // edges may initially empty
        if (this.edges.length === 0 || this.concepts.length === 0)
          return;
        this.nodes = _.cloneDeep(this.concepts);
        this.links = _.cloneDeep(this.edges);
        // get width and height
        var root = d3.select(this.$el).node();
        this.width = root.getBoundingClientRect().width;

        // set the x scale to set the position of the nodes to the corresponding position of paracoord
        var margin = {
          top: 66,
          right: 40,
          bottom: 20,
          left: 60
        }
        let xScale = d3.scaleLinear()
          .domain([0, this.nodes.length - 1])
          .range([0 + margin.left, this.width - margin.right]);

        this.nodes.forEach((node, i) => {
          this.nodes[i] = {
            name: node,
            // the node's fixed x-position
            fx: xScale(i),
          };
        });
        // start to draw, main entry
        var that = this;
        var colors = d3.scaleOrdinal(d3.schemeCategory10);

        // set the color scale for the risk ratio labels
        let label_color = d3.scaleLinear()
          .domain(d3.extent(this.links, d => d.value))
          .range([d3.rgb(211, 211, 211), d3.rgb(211, 211, 211)]);

        var svg = d3.select(this.$el).select("svg")
            .attr("width", this.width)
            .attr("height", this.height),
          edgepaths,
          edgelabels,
          node,
          link;

        svg.append('defs').append('marker')
          .attrs({
            'id': 'arrow',
            'viewBox': '-0 -5 10 10',
            'refX': 13,
            'refY': 0,
            'orient': 'auto',
            'markerWidth': 8,
            'markerHeight': 8,
          })
          .append('path')
          .attrs({
            'd': 'M 0,-5 L 10 ,0 L 0,5',
            'fill': '#999'
          })

        // collide radius to prevent overlapping
        let radius = (this.width - 40) / this.nodes.length;
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink()
            .id(d => d.name)
            .distance(100)
            .strength(1))
          .force("charge", d3.forceManyBody())
          .alphaTarget(0.5)
          .force("center", d3.forceCenter(this.width / 2, this.height / 2))
          .force("collide", d3.forceCollide(radius / 2))

        var links = this.links;
        var nodes = this.nodes;

        update(links, nodes);

        function update(links, nodes) {
          link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end', 'url(#arrow)')

          link.append("title")
            .text(function (d) {
              return d.value;
            });

          edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
              'class': 'edgepath',
              'fill-opacity': 0,
              'stroke-opacity': 0,
              'id': function (d, i) {
                return 'edgepath' + i
              }
            })
            .style("pointer-events", "none");

          edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
              'class': 'edgelabel',
              'id': function (d, i) {
                return 'edgelabel' + i
              },
              'font-size': "1rem",
              'fill': d => label_color(d.value)
            });

          edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {
              return '#edgepath' + i
            })
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {
              return d.value.toFixed(2)
            })
          // .attr("color", d => label_color(d.value));

          node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
              //.on("end", dragended)
            );

          node.append("circle")
            .attr("r", 6)
            .style("fill", function (d, i) {
              return colors(i);
            });

          node.append("text")
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(function (d) {
              return d.name;
            }).on("click", function(d) {
              that.$router.push(/videos/ + d.name);
            });

          simulation.nodes(nodes)
            .on("tick", ticked);

          simulation.force("link")
            .links(links);
        }

        function ticked() {
          link.attr("x1", function (d) {
            return d.source.x;
          })
            .attr("y1", function (d) {
              return d.source.y;
            })
            .attr("x2", function (d) {
              return d.target.x;
            })
            .attr("y2", function (d) {
              return d.target.y;
            });

          node.attr("transform", function (d) {
            return "translate(" + d.x + ", " + d.y + ")";
          });

          edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
          });

          edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
              var bbox = this.getBBox();

              var rx = bbox.x + bbox.width / 2;
              var ry = bbox.y + bbox.height / 2;
              return 'rotate(180 ' + rx + ' ' + ry + ')';
            } else {
              return 'rotate(0)';
            }
          });
        }

        // fix the y coord to enforce the correspondence of node and parallel coordinates
        function dragstarted(d) {
          if (!d3.event.active)
            simulation.alphaTarget(0.5).restart();
          // d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          // d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #root {
    width: 100%;
    svg {
      width: 100%;
    }
  }
</style>

<style lang="scss">
  .node {}

  .link {
    stroke: #999;
    stroke-opacity: .6;
    stroke-width: 1px;
  }
</style>
