import * as types from '../mutation-types'
import backend from '@/api/backend_axios'
import Vue from 'vue'

// initial state
const state = {
  concepts: [],
  concept_means: {},
  concept_edges: [],
  student_concept_scores: [],
  filtered_students: []
}

// getters
const getters = {
  allConcepts: state => state.concepts,
  allConceptEdges: state => state.concept_edges,
  allStudentScores: state => state.student_concept_scores,
  allFilteredStudents: state => state.filteredStudents
}

// actions
const actions = {
  async fetchConcepts ({ commit }) {
    try {
      const { data } = await backend.fetchConcepts()
      commit(types.SET_CONCEPTS, data)
    } catch(e) {
      console.log(e)
    }
  },
  async fetchConceptMeans ({ commit }) {
    try {
      const { data } = await backend.fetchConceptMeans()
      commit(types.SET_CONCEPT_MEANS, data)
    } catch(e) {
      console.log(e)
    }
  },
  async fetchConceptEdges ({ commit }) {
    try {
      const { data } = await backend.fetchConceptEdges()
      commit(types.SET_CONCEPT_EDGES, data)
    } catch(e) {
      console.log(e)
    }
  },
  async fetchStudentScores ({ commit }) {
    try {
      const { data } = await backend.fetchStudentScores()
      commit(types.SET_STUDENT_SCORES, data)
    } catch(e) {
      console.log(e)
    }
  },
}

// mutations
const mutations = {
  [types.SET_CONCEPTS] (state, concepts) {
    Vue.set(state, 'concepts', concepts)
  },
  [types.SET_CONCEPT_MEANS] (state, means) {
    Vue.set(state, 'concept_means', means)
  },
  [types.SET_CONCEPT_EDGES] (state, edges) {
    Vue.set(state, 'concept_edges', edges)
  },
  [types.SET_STUDENT_SCORES] (state, scores) {
    Vue.set(state, 'student_concept_scores', scores)
  },
  [types.SET_FILTERED_STUDENTS] (state, students) {
    Vue.set(state, 'filtered_students', students)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}