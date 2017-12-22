<template>
  <b-container fluid>
    <div>
      <span> Total students filtered: </span>
      <b-badge pill variant="light">{{filtered_students.length}}</b-badge>
      <b-badge variant="danger">{{selectedStudent.size}}</b-badge>
    </div>

      <b-table hover responsive small show-empty fixed :per-page="rows_per_page" :height="height"
               :items="filtered_students" :fields="fields" :current-page="current_page" @row-clicked="info">

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
      <!-- Info modal -->
      <b-modal centered id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>

        <b-card title="Scores">
          <b-table small bordered hover :fields="modal_fields" :items="modalInfo.content.table"></b-table>
        </b-card>


        <b-card title="Suggested learning path" v-if="modalInfo.content && modalInfo.content.path.length">

          <span v-for="(node, index) in modalInfo.content.path">
            {{node}}
            <icon v-if="index != modalInfo.content.path.length - 1" name="arrow-right" scale="0.8"></icon>
          </span>

          <count-down-alert></count-down-alert>

        </b-card>

      </b-modal>

      <b-pagination size="md" align="center"
                    :total-rows="filtered_students.length"
                    v-model="current_page" :per-page="rows_per_page">
      </b-pagination>
    </b-container>
</template>

<script>
  import {mapState} from 'vuex'
  import _ from 'lodash';
  import backend from '@/api/backend_axios'
  import CountDownAlert from "./CountDownAlert";

  export default {
    components: {CountDownAlert},
    name: "ScoreTable",
    data() {
      return {
        current_page: 1, rows_per_page: 10,
        height: 400,
        modalInfo: { title: '', content: '' },
        allSelected: false,
        indeterminate: false,
        selectedStudent: new Set(),
        modal_fields: [
          {key: "concept", sortable:true},
          {key: "grade", sortable:true},
          {key: "mean", sortable:true},
        ],
      }
    },
    computed: {
      ...mapState({
        filtered_students: state => state.learning_objects.filtered_students,
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
          let keys = _.keys(this.filtered_students[0])
          let fields =  _.map(keys, key => ({'key': key, 'sortable': true}))
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
      async getRecommendation(student_id) {
        const { data } = await backend.getRecommendation(student_id)
        return data
      },
      async info(item, index, event) {
        this.modalInfo.title = `student id: ${item.student_id}`
//        this.modalInfo.content = JSON.stringify(item, null, 2)
        this.modalInfo.content = await this.getRecommendation(item.student_id)
        this.$root.$emit('bv::show::modal', 'modalInfo', event)
      },
      resetModal() {
        this.modalInfo.title = ''
        this.modalInfo.content = ''
      },
    }
  }
</script>