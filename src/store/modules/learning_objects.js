import * as types from '../mutation-types'
import backend from '@/api/backend_axios'

// initial state
const state = {
  concepts: [],
  concept_edges: [],
  student_concept_scores: [],
  selected_students: []
}

// getters
const getters = {
  allConcepts: state => state.concepts,
  allConceptEdges: state => state.concept_edges,
  allStudentScores: state => state.student_concept_scores,
  allSelectedStudents: state => state.selectedStudents
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
    state.concepts = concepts
  },
  [types.SET_CONCEPT_EDGES] (state, edges) {
    state.concept_edges = edges
  },
  [types.SET_STUDENT_SCORES] (state, scores) {
    state.student_concept_scores = scores
  },
  [types.SET_SELECTED_STUDENTS] (state, students) {
    state.selected_students = students
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}