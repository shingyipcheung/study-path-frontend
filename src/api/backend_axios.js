import axios from 'axios'
import app from '../main'; // import the instance
import _ from 'lodash';

const instance = axios.create({
  // baseUrl = 'http://127.0.0.1:8000'
  baseURL: 'http://143.89.76.37:8000'
});
// set global headers
// allow cross origin http traffics
instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
instance.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
instance.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin';


instance.interceptors.request.use(config => {
  app.$Progress.start(); // for every request start the progress
  return config;
});

const finish = _.debounce(() => {
  app.$Progress.finish()
}, 800);

instance.interceptors.response.use(response => {
  finish(); // finish when a response is received
  return response;
});

export default {
  fetchConcepts () {
    return instance.get(`/study_plan/concepts/`)
  },
  fetchConceptMeans () {
    return instance.get(`/study_plan/means/`)
  },
  fetchConceptEdges () {
    return instance.get(`/study_plan/graph/`)
  },
  fetchStudentScores () {
    return instance.get(`/study_plan/concept_score/all/`)
  },
  getRecommendation(student_id) {
    return instance.get(`/study_plan/recommendation/${student_id}/`)
  },
  getVideos(concept) {
    return instance.get(`/study_plan/videos/${concept}/`)
  }
}