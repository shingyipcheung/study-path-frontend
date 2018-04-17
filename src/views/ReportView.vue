<template>
  <b-container>

    <b-row>
      <b-col md="8">
        <!-- Graph -->
        <b-card title="Learning Object Dependency Graph">
          <hr>
          <learning-object-tree :path="selectedIndex == -1 ? null: paths[selectedIndex]"></learning-object-tree>
        </b-card>
        <!-- /graph -->

        <!-- paths -->
        <b-card v-if="paths && paths.length">
          <div class="card-title">
            <b-row>
              <b-col>
                <h4>Recommended Study Paths</h4>
              </b-col>
              <b-col>
                <div v-if="selectedIndex !== -1">
              <b-btn variant="link" @click="reset" size="sm" class="float-right">
                <icon name="sync-alt" style="color: #5b5b5b;"></icon>
              </b-btn>
            </div>
              </b-col>
            </b-row>


            <!--<hr>-->
          </div>
          <b-card class="list" style="height:400px; overflow-y: scroll">
            <div class="path" v-for="(path, index) in paths" :key="index">
              <b-row no-gutters align-v="center">
                <b-col cols="2">
                  <b-badge :variant="selectedIndex === index ? 'warning': 'dark'" @click.prevent="clicked(index)" href="#">
                    {{ "Pathway "+ (index + 1)}}
                  </b-badge>
                </b-col>
                <b-col cols="9">
                  <span v-for="(node, index) in path" :key="index">
                    <span :class="{ pass: !failedObj.has(node) }"> {{node}}</span>
                    <icon v-if="index !== path.length - 1" name="arrow-right" scale="0.5"></icon>
                  </span>
                </b-col>
              </b-row>
              <hr>
            </div>
          </b-card>

          <count-down-alert></count-down-alert>
        </b-card>
        <!-- /path -->
      </b-col>
      
      <b-col md="4">
        <!-- table -->
        <b-card title="Scores">
          <b-table v-if="table" :sort-by.sync="sortBy" small bordered hover :fields="fields" :items="table"></b-table>
        </b-card>
        <!-- /table -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import CountDownAlert from "../components/CountDownAlert";
  import LearningObjectTree from '../components/LearningObjectTree';
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions, mapMutations } = createNamespacedHelpers('learning_objects')

  import backend from '@/api/backend_axios';

  export default {
    components: {CountDownAlert, LearningObjectTree},
    name: "student-report",
    props: ['id'],
    data() {
      return {
        paths: null,
        selectedIndex: -1,
        table: null,
        sortBy: null,
        failedObj: null,
        modalInfo: { title: '', content: '' },
        fields: [
          {key: "Learning Object", sortable:true},
          {key: "Score", sortable:true},
          {key: "Avg. Score", sortable:true},
        ],
      }
    },
    created() {
      Promise.all([
          this.fetchConcepts(),
          this.fetchConceptEdges(),
      ])
      this.fetchReport(this.id);
      this.resetSelectedPath()
    },
    watch: {
      id() {
        this.fetchReport(this.id);
      }
    },
    methods: {
      ...mapMutations({
        setSelectedPath: 'SET_SELECTED_PATH',
        resetSelectedPath: 'INIT_SELECTED_PATH'
      }),
      ...mapActions(['fetchConcepts', 'fetchConceptEdges']),

      clicked(index) {
        if (this.table.length !== this.paths[index].length)
          return;
        this.selectedIndex = index
        this.sortBy = null
        this.$nextTick(() => {
          const path = this.paths[index];
          // will update the path in learning view
          this.setSelectedPath(path);
          const names = _.map(this.table, "Learning Object");
          let temp = [];
          path.forEach(node => {
            temp.push(this.table[_.indexOf(names, node)])
          });
          this.table = temp;
        });
      },
      async fetchReport(student_id) {
        if (student_id != null)
        {
          let { data } = await backend.getRecommendation(student_id)
          this.paths = data.paths
          this.table = data.table
          this.failedObj = new Set()
          this.table.map((row) => {
            if (row["_rowVariant"] === "danger")
              this.failedObj.add(row["Learning Object"])
          })
        }
      },
      reset() {
        this.selectedIndex = -1
        this.resetSelectedPath()
      }
    }
  }
</script>

<style scoped>
  span {
    font-size: smaller
  }
  .pass {
    color: #c8c8c8;
  }

  .list::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0, 0.1);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  .list::-webkit-scrollbar
  {
    width: 8px;
    background-color: #F5F5F5;
  }

  .list::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
</style>