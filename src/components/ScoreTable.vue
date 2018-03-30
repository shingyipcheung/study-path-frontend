<template>
  <b-container fluid>
    <div>
      <span> Total students selected: </span>
      <b-badge pill variant="light">{{filtered_students.length}}</b-badge>
      <b-badge variant="danger">{{selectedStudent.size}}</b-badge>
    </div>

      <b-table hover responsive small show-empty :per-page="rows_per_page" :style="{height: height + 'px'}"
               :items="filtered_students" :fields="fields" :current-page="current_page" @row-clicked="showReport">

        <!--show details-->
        <template slot="show" slot-scope="row">
          <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
          <b-form-checkbox @click.native.stop
                           @change="toggleSelected(row.item.student_id)"
                           :checked="selectedStudent.has(row.item.student_id)">
          </b-form-checkbox>
        </template>

        <template slot="HEAD_show" slot-scope="row">
          <b-form-checkbox @click.native.stop
                           @change="toggleAll"
                           :indeterminate="indeterminate"
                           v-model="allSelected">
          </b-form-checkbox>
        </template>

      </b-table>
      <!--&lt;!&ndash; Info modal &ndash;&gt;-->
      <!--<b-modal size="md" centered id="ReportModel" @hide="resetModal" :title="model_title" ok-only>-->
        <!--<student-report :id="id"></student-report>-->
      <!--</b-modal>-->

      <b-pagination size="md" align="center"
                    :total-rows="filtered_students.length"
                    v-model="current_page" :per-page="rows_per_page">
      </b-pagination>
    </b-container>
</template>

<script>
  import {mapState} from 'vuex'
  import _ from 'lodash';
  import StudentReport from "../views/ReportView";

  export default {
    components: {StudentReport},
    name: "ScoreTable",
    data() {
      return {
        current_page: 1, rows_per_page: 10,
        height: 400,
        allSelected: false,
        indeterminate: false,
        selectedStudent: new Set(),
        model_title: "",
        id: null,
      }
    },
    computed: {
      ...mapState({
        filtered_students: state => state.learning_objects.filtered_students,
        concepts: state => state.learning_objects.concepts,
      }),
      filtered_student_id() {
        return _.map(this.filtered_students, 'student_id')
      },
      fields() {
//        fields: [
//          {key: "student_id", sortable: true}...
//        ],
        if (this.filtered_students.length > 0)
        {
          let keys = this.concepts
          let fields = _.map(keys, key => ({'key': key, 'sortable': true}))
          fields.unshift({'key': 'student_id', 'sortable': true})
          fields.unshift('show')
          return fields
        }
      }
    },
    watch: {
      filtered_students() {
        this.selectedStudent = new Set()
      },
      selectedStudent() {
        this.updateState()
      }
    },
    methods: {
      toggleAll() {
        this.allSelected = !this.allSelected
        if (this.allSelected)
          this.selectedStudent = new Set(this.filtered_student_id)
        else
          this.selectedStudent = new Set()
      },
      updateState()
      {
        if (this.selectedStudent.size === 0) {
          this.indeterminate = false
          this.allSelected = false
        }
        else if (this.selectedStudent.size === this.filtered_students.length)
        {
          this.indeterminate = false
          this.allSelected = true
        }
        else {
          this.indeterminate = true
          this.allSelected = false
        }
      },
      toggleSelected(student_id) {
        if (this.selectedStudent.has(student_id))
          this.selectedStudent.delete(student_id)
        else
          this.selectedStudent.add(student_id)
        this.updateState()
        this.$forceUpdate()
      },
      showReport(item, index, event) {
        // this.model_title = `student id: ${item.student_id}`
        // this.id = item.student_id
        // this.$root.$emit('bv::show::modal', 'ReportModel', event)
        this.$router.push({
          name: 'report',
          params: {
            id: item.student_id
          }
        })
      },
      // resetModal() {
      //   this.model_title = ""
      //   this.id = null
      // }
    }
  }
</script>