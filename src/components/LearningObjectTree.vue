<template>
  <div>
    <svg></svg>
  </div>
</template>

<script>
// http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
import * as d3 from 'd3';
import "d3-selection-multi";
import _ from 'lodash';
import axios from 'axios';

export default {
  name: "learning-object-tree",
  data() {
    return {
      nodes:[],
      links:[],
      width: 1100,
      height: 200,
    }
  },
  mounted() {
    axios.all([
      axios.get("http://127.0.0.1:8000/study_plan/concepts/"),
      axios.get("http://127.0.0.1:8000/study_plan/graph/")
    ])
    .then(axios.spread((conceptsRes, edgesRes) => {
      // nodes
      this.nodes = conceptsRes.data;

      // set the x scale to set the position of the nodes to the corresponding position of paracoord
      var margin = {top: 66, right: 40, bottom: 20, left: 50}
      let x_scale = d3.scaleLinear()
        .domain([0, this.nodes.length - 1])
        .range([0 + margin.left, this.width - margin.right]);

      this.nodes.forEach((node, i) => {
        this.nodes[i] = {
          name: node,
          fx: x_scale(i),
          y: this.height / 2 // this line doesn't work here.
        };
      });

      // links
      this.links = edgesRes.data;
      this.links.forEach((link) => {
          link["source"] = _.find(this.nodes, d => d.name == link['source']);
          link['target'] = _.find(this.nodes, d => d.name == link['target']);
      });

      // start to draw, main entry
      this.start_draw();
    }))
    .catch(error => console.log(error));
  },
  methods: {
    // main entry for the drawing function
    start_draw() {
      var that = this;
      var colors = d3.scaleOrdinal(d3.schemeCategory10);

      // set the color scale for the risk ratio labels
      let label_color = d3.scaleLinear()
        .domain(d3.extent(this.links, d => d.value))
        .range([d3.rgb("#FFCC99"), d3.rgb('#FF0000')]);

      var svg = d3.select(this.$el).select("svg")
        .attr("width", this.width)
        .attr("height", this.height),
          edgepaths,
          edgelabels,
          node,
          link;

      svg.append('defs').append('marker')
          .attrs({'id':'arrowhead',
              'viewBox':'-0 -5 10 10',
              'refX':13,
              'refY':0,
              'orient':'auto',
              'markerWidth':13,
              'markerHeight':13,
              'xoverflow':'visible'})
          .append('svg:path')
          .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
          .attr('fill', '#999')
          .style('stroke','none');

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function (d) {return d.name;}).distance(100).strength(1))
          .force("charge", d3.forceManyBody())

      var links = this.links;
      var nodes = this.nodes;

      update(links, nodes);

      function update(links, nodes) {
          link = svg.selectAll(".link")
              .data(links)
              .enter()
              .append("line")
              .attr("class", "link")
              .attr('marker-end','url(#arrowhead)')

          link.append("title")
              .text(function (d) {return d.value;});

          edgepaths = svg.selectAll(".edgepath")
              .data(links)
              .enter()
              .append('path')
              .attrs({
                  'class': 'edgepath',
                  'fill-opacity': 0,
                  'stroke-opacity': 0,
                  'id': function (d, i) {return 'edgepath' + i}
              })
              .style("pointer-events", "none");

          edgelabels = svg.selectAll(".edgelabel")
              .data(links)
              .enter()
              .append('text')
              .style("pointer-events", "none")
              .attrs({
                  'class': 'edgelabel',
                  'id': function (d, i) {return 'edgelabel' + i},
                  'font-size': "1rem",
                  'fill': d => label_color(d.value)
              });

          edgelabels.append('textPath')
              .attr('xlink:href', function (d, i) {return '#edgepath' + i})
              .style("text-anchor", "middle")
              .style("pointer-events", "none")
              .attr("startOffset", "50%")
              .text(function (d) {return d.value.toFixed(2)})
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
              .attr("r", 5)
              .style("fill", function (d, i) {return colors(i);});

          node.append("text")
              .attr("dy", -3)
              .attr("text-anchor", "middle")
              .text(function (d) {return d.name;});

          simulation.nodes(nodes)
              .on("tick", ticked);

          simulation.force("link")
              .links(links);
      }

      // setting y not working in the upper there.
      var initialized = false;

      function ticked() {
        if (! initialized) {
          that.nodes.forEach(node => {
            node.y = that.height / 2;
          })
          initialized = true;
        }
        link.attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node.attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                var rx = bbox.x + bbox.width / 2;
                var ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
      }

      // fix the y coord to enforce the correspondence of node and parallel coordinates
      function dragstarted(d) {
          if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
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

<style>
.node {}

.link { stroke: #999; stroke-opacity: .6; stroke-width: 1px; }
</style>
