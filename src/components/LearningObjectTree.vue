<template>
  <div id="root">
    <svg>
      <defs>
        <marker id="arrow" viewBox="-0 -5 10 10" refX="13" refY="0" orient="auto" markerWidth="8" markerHeight="8">
          <path d="M 0,-5 L 10 ,0 L 0,5" fill="#999"></path>
        </marker>
      </defs>
    </svg>
  </div>
</template>
<script>
  // http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
  import * as d3 from 'd3';
  import * as d3Chromatic from 'd3-scale-chromatic';

  import "d3-selection-multi";
  import _ from 'lodash';

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
        width: 1100,
        height: 300,
        margin: {
          top: 66,
          right: 60,
          bottom: 20,
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
        const s = n * p;
        return d3.scaleLinear().domain([0, n - 1]).range([s, n - 1 - s]);
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
        let colors, trim, positionX, positionY;

        if (this.path === null || this.path === undefined)
        {
          colors = d3.scaleOrdinal(d3.schemeCategory10);

          positionX = d3.scaleLinear()
          .domain([0, this.nodes.length - 1])
          .range([this.margin.left, this.width - this.margin.right]);

          this.nodes.forEach((node, i) => {
            this.nodes[i] = {
              name: node,
              // the node's fixed x-position
              fx: positionX(i)
            };
          });
        }
        else
        {
          colors = d3.scaleSequential(d3Chromatic.interpolateOrRd).domain([this.path.length - 1, 0]);
          trim = this.trimScale(this.path.length, 0.);
          positionX = d3.scaleLinear()
          .domain([0, this.nodes.length / this.nodesPerColumn - 1])
          .range([this.margin.left, this.width - this.margin.right]);

          positionY = d3.scaleLinear()
          .domain([0, this.nodesPerColumn])
          .range([this.margin.top, this.height - this.margin.bottom]);

          this.nodes.forEach((node, i) => {
            this.nodes[i] = {
              name: node,
              fx: positionX(Math.trunc(that.path.indexOf(node) / that.nodesPerColumn)),
              fy: positionY(that.path.indexOf(node) % that.nodesPerColumn),
            };
          });
        }


        // set the color scale for the risk ratio labels
        let label_color = d3.scaleLinear()
          .domain(d3.extent(this.links, d => d.value))
          .range([d3.rgb(211, 211, 211), d3.rgb(211, 211, 211)]);

        let svg = d3.select(this.$el).select("svg")
            .attr("width", this.width)
            .attr("height", this.height),
          edgepaths,
          edgelabels,
          node,
          link;
        svg.selectAll("*").remove();
        // collide radius to prevent overlapping
        let radius = (this.width - 40) / this.nodes.length;
        let simulation = d3.forceSimulation()
          .force("link", d3.forceLink()
            .id(d => d.name)
            .distance(100)
            .strength(1))
          .force("charge", d3.forceManyBody())
          .alphaTarget(0.5)
          .force("center", d3.forceCenter(this.width / 2, this.height / 2))
          .force("collide", d3.forceCollide(radius / 2));

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

          node.append("circle")
            .attr("r", 6)
            .style("fill", function (d, i) {
              if (that.path != null && that.path !== undefined)
              {
                let index = that.path.indexOf(d.name);
                return colors(trim(index));
              }
              return colors(i);
            })
            .on("mouseover", function () {
              d3.select(this).attr("r", 8);
            })
            .on('mouseout', function () {
              d3.select(this).transition().duration(500).attr("r", 6);
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
