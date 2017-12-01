<template>
  <div id="student-details" class="student-details">
    <div>
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
</template>

<script>
  import {mapState} from 'vuex'
  import _ from 'lodash';
  export default {
    name: "ScoreTable",
    data() {
      return {
//        // data required for the table and pagination
//        fields: [
//          {key: "student_id", sortable: true},
//          {key: "primitive_type", sortable: true},
//          {key: "variable", sortable: true},
//          {key: "operator", sortable: true},
//          {key: "array", sortable: true},
//          {key: "nd_array", sortable: true},
//          {key: "string", sortable: true},
//          {key: "branch", sortable: true},
//          {key: "loop", sortable: true},
//          {key: "object_class", sortable: true},
//          {key: "instance_variable", sortable: true},
//          {key: "method", sortable: true},
//          {key: "recursion", sortable: true},
//        ],
        fields: [],
        current_page: 1, rows_per_page: 10
      }
    },
    computed: {
      ...mapState({
        selected_students: state => state.learning_objects.selected_students,
      })
    },
      // data required for the table and pagination
    watch: {
     selected_students() {
        if (this.selected_students.length > 0)
        {
          let keys = this.selected_students.keys();
          this.fields = _.map(keys, key => ({'key': key, 'sortable': true}))
        }
      }
    }
  }
</script>