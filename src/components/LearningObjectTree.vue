<template>
  <div id="root">
    <svg></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import "d3-selection-multi";

export default {
  name: "learning-object-tree",
  data() {
    return {
      nodes_raw:[
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
      nodes:[],
      links_raw:[],
      links:[]
    }
  },
  mounted() {
    //pre-process the nodes
    var nodes = [];
    for (var i = 0; i < this.nodes_raw.length; i ++) {
      nodes.push({
        "name": this.nodes_raw[i],
        "label": this.nodes_raw[i],
        "id": i
      });
    }
    this.nodes = nodes;
    // console.log(this.nodes);

    this.$http.get('http://127.0.0.1:8000/study_plan/graph/').then(res => {
      // console.log(res.data);
      this.links_raw = res.data;
      // pre-process the links to fit the format
      var links = [];
      for (var i = 0; i < this.links_raw.length; i++) {
        var link = this.links_raw[i];
        console.log(link['source'], this.nodes_raw.findIndex(d => d == link['source']));
        links.push({
          "source": this.nodes[this.nodes_raw.findIndex(d => d == link['source'])],
          "target": this.nodes[this.nodes_raw.findIndex(d => d == link['target'])],
          "value": link['value']
        });
      }
      this.links = links;
      console.log(links);

      // start to draw
      this.start_draw();
    }, res => {
      console.error(res);
    })
  },
  methods: {
    // main entry for the drawing function
    start_draw() {
      var that = this;
      var colors = d3.scaleOrdinal(d3.schemeCategory10);

      var svg = d3.select("svg"),
          width = 1100,
          height = 200,
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
          .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
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
                  'font-size': 10,
                  'fill': '#aaa'
              });

          edgelabels.append('textPath')
              .attr('xlink:href', function (d, i) {return '#edgepath' + i})
              .style("text-anchor", "middle")
              .style("pointer-events", "none")
              .attr("startOffset", "50%")
              .text(function (d) {return d.type});

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
              .style("fill", function (d, i) {return colors(i);})

          node.append("title")
              .text(function (d) {return d.id;});

          node.append("text")
              .attr("dy", -3)
              .text(function (d) {return d.name;});

          simulation.nodes(nodes)
              .on("tick", ticked);

          simulation.force("link")
              .links(links);
      }

      var initialized = false;

      function ticked() {
        if(!initialized) {
          // can also check multiple nodes here...
          if(!initialized) initialize();
        } else {
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
      }



      function initialize() {
        //set the node to fixed x
        var margin = {top: 66, right: 40, bottom: 20, left: 50}
        var x_scale = d3.scaleLinear()
          .domain([0, that.nodes.length - 1])
          .range([0 + margin.left, width - margin.right]);

        nodes.forEach((node, i) => {
          // node.x = width/2;
          console.log(x_scale(i));
          node.fx = x_scale(i);
          node.y = height/2;
        })
        initialized = true;
      }

      function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x;
          d.fy = d.y;
      }

      function dragged(d) {
          d.fx = d3.event.x;
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

<style scoped>
#root svg {
  width: 1100px;
  height: 200px;
}
</style>
