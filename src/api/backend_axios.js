import axios from 'axios'
import app from '../main'; // import the instance
import _ from 'lodash';
import { cacheAdapterEnhancer } from 'axios-extensions';

const instance = axios.create({
  // for development
  // baseURL: 'http://143.89.76.37:8000',
  // set global headers
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json, text/plain, */*',
    'Access-Control-Allow-Headers': 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin',
  },
  // cache will be enabled by default
	adapter: cacheAdapterEnhancer(axios.defaults.adapter, true)
});

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
  },
  getProblems(concept) {
    return instance.get(`/study_plan/problems/${concept}/`)
  },
  getProblemHTML(problem_id) {
    return instance.get(`/study_plan/problem/html/${problem_id}/`)
  }
}