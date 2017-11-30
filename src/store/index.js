import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import learning_objects from './modules/learning_objects'

Vue.use(Vuex)

export default new Vuex.Store({
  // actions,
  // getters,
  modules: {
    learning_objects,
  },
  strict: true
})