import Vue from 'vue'

// import boostrap-vue module
// https://bootstrap-vue.js.org/docs/
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import youtube embed
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)

// import VueResource module
import VueResource from 'vue-resource'
Vue.use(VueResource);

// import vue awesome
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

// not to use Vuetify because of a bug
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// Vue.use(Vuetify);

// set global headers
// allow cross origin http traffics
Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
Vue.http.headers.common['Accept'] = 'application/json, text/plain, */*'
Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin'

Vue.config.productionTip = false

// import vuex store
import store from './store'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
