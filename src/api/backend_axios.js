import axios from 'axios'

 const baseUrl = 'http://127.0.0.1:8000'
// const baseUrl = 'http://143.89.76.37:8000'

export default {
  fetchConcepts () {
    return axios.get(`${baseUrl}/study_plan/concepts/`)
  },
  fetchConceptMeans () {
    return axios.get(`${baseUrl}/study_plan/means/`)
  },
  fetchConceptEdges () {
    return axios.get(`${baseUrl}/study_plan/graph/`)
  },
  fetchStudentScores () {
    return axios.get(`${baseUrl}/study_plan/concept_score/all/`)
  },
  getRecommendation(student_id) {
    return axios.get(`${baseUrl}/study_plan/recommendation/${student_id}/`)
  },
  getVideos(concept) {
    return axios.get(`${baseUrl}/study_plan/videos/${concept}/`)
  }
}