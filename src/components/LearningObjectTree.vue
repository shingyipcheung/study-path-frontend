<template>
  <div id="root">
    <svg>
    </svg>
  </div>
</template>

<script>
  // http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
  import * as d3 from 'd3';
  import * as d3Chromatic from 'd3-scale-chromatic';

  import "d3-selection-multi";
  import _ from 'lodash';
  import dagre from 'dagre';

  import { createNamespacedHelpers } from 'vuex';

  const { mapGetters } = createNamespacedHelpers('learning_objects');

  export default {
    name: "learning-object-tree",
    props: {
		  path: {
		    type: Array,
		  },
    },
    data() {
      return {
        nodes: [],
        links: [],
        linkSet: new Set(),
        width: 1100,
        height: 300,
        margin: {
          top: 30,
          right: 60,
          bottom: 30,
          left: 60
        },
        nodesPerColumn: 3,
      }
    },
    computed: {
      ...mapGetters({
        concepts: 'allConcepts',
        edges: 'allConceptEdges',
      }),
    },
    mounted() {
      window.addEventListener('resize', this.render);
      if (this.path !== undefined)
        this.$watch('path', this.render);
      this.render();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.render);
    },
    activated() {
      this.render();
    },
    created() {
      this.watchCollection(['concepts', 'edges'], this.render);
    },
    methods: {
      trimScale(n, p) {
        const space = n * p;
        return d3.scaleLinear().domain([0, n - 1]).range([space, n - 1 - space]);
      },
      // main entry for the drawing function
      render: _.debounce(function() {
        // edges may initially empty
        if (this.edges.length === 0 || this.concepts.length === 0)
          return;
        this.nodes = _.cloneDeep(this.concepts);
        this.links = _.cloneDeep(this.edges);
        // get width and height
        let root = d3.select(this.$el).node();
        this.width = root.getBoundingClientRect().width;
        // start to draw, main entry
        let that = this;
        let positionX = d3.scaleLinear()
          .domain([0, this.nodes.length - 1])
          .range([this.margin.left, this.width - this.margin.right]);
        let colors = d3.scaleOrdinal(d3.schemeCategory10);

        let g = new dagre.graphlib.Graph();
        let xsep = positionX(1) - positionX(0);
        g.setGraph({});
        g.setDefaultEdgeLabel(function() { return {}; });
        g.setGraph({
          rankdir: 'LR',
          edgesep: 0,
          // vertical sep
          nodesep: xsep,
          // horizontal sep
          ranksep: xsep,
          marginx: this.margin.left,
          marginy: this.margin.top,
          ranker: 'longest-path'
        });
        this.nodes.forEach((node, i) => {
            g.setNode(node, {label: node});
            this.nodes[i] = {
              name: node,
            };
        });

        this.links.forEach((link) => {
          this.linkSet.add(link.source + "," + link.target);
          g.setEdge(link.source, link.target)
        });

        dagre.layout(g);
        this.height = g.graph().height;
        this.nodes.forEach((node, i) => {
            const n = g.node(node.name);
            node.fx = n.x;
            node.targetY = n.y + 10; //   node.targetY: that.height / 2
            //   // the node's fixed x-position
            node.fx = positionX(i);
        });

        if (this.path != null && this.path !== undefined)
        {
          // override default colors
          colors = d3.scaleSequential(d3Chromatic.interpolateOrRd).domain([this.path.length - 1, 0]);
          const trim = this.trimScale(this.path.length, 0.);
          this.nodes = _.cloneDeep(this.path);
          this.nodes.forEach((node, i) => {
            this.nodes[i] = {
              name: node,
              trimIndex: trim(i),
              // the node's fixed x-position
              fx: positionX(i),
              // targetX: g.node(node).x,
              targetY: g.node(node).y + 10//that.height / 2
            };
          });
        }

        // set the color scale for the risk ratio labels
        let label_color = d3.scaleLinear()
          .domain(d3.extent(this.links, d => d.value))
          .range([d3.rgb(211, 211, 211), d3.rgb(211, 211, 211)]);

        d3.select(this.$el).selectAll("*").remove();

        let svg = d3.select(this.$el).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
            // .call(d3.zoom().scaleExtent([0.5, 2]).on("zoom", function () {
            //   svg.attr("transform", d3.event.transform)
            // })).append("g")
        let edgepaths, edgelabels, node, link;

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
          });

        // collide radius to prevent overlapping
        let simulation = d3.forceSimulation()
          .force("link", d3.forceLink()
            .id(d => d.name)
            .distance(xsep)
            .strength(0.5))
          .force("charge", d3.forceManyBody())
          // .alphaDecay(0.03)
          .force("x", d3.forceX(function(d) { return d.targetX;}))
          .force("y", d3.forceY(function(d) { return d.targetY;}))
          // .alphaTarget(0.5)
          .alphaMin(0.0001)
          // .force("center", d3.forceCenter(this.width / 2, this.height / 2))
          .force("collide", d3.forceCollide(xsep));

        let links = this.links;
        let nodes = this.nodes;

        update(links, nodes);

        function update(links, nodes) {
          link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end', 'url(#arrow)');

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
            });
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
            )
            .on("click", function (d) {
              that.$router.push(/learning/ + d.name);
            });
          function isConnected(source, target) {
            return that.linkSet.has(source.name+","+target.name)
              || that.linkSet.has(target.name+","+source.name)
          }
          node.append("circle")
            .attr("r", 6)
            .style("fill", function (d, i) {
              if (d.trimIndex !== undefined)
                return colors(d.trimIndex);
              return colors(i);
            })
            .on("mouseover", function (d) {
              d3.select(this).attr("r", 8);
              node.style("fill-opacity", function(other) {
                if(other !== d && !isConnected(d,other))
                  return 0.1;
                return 1;
              });
              // // also style link accordingly
              link.style("stroke-opacity", function(o) {
                  return o.source === d || o.target === d ? 0.6 : 0.2;
              });
              link.style("stroke", function(o){
                  return o.source === d || o.target === d ? "#000" : link.style("stroke");
              });
            })
            .on('mouseout', function () {
              d3.select(this).transition().duration(500).attr("r", 6);
              node.style("fill-opacity", 1);
              link.style("stroke-opacity", 0.6);
              link.style("stroke", "#999");
            });

          node.append("text")
            .attr("dy", -7)
            .attr("text-anchor", "middle")
            .text(function (d) {
              return d.name;
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
              let bbox = this.getBBox();

              let rx = bbox.x + bbox.width / 2;
              let ry = bbox.y + bbox.height / 2;
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
      }, 200)
      // debounce end
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
  .node:hover {
    cursor: pointer;
  }
  .link {
    stroke: #999;
    stroke-opacity: .6;
    stroke-width: 1px;
  }
</style>
