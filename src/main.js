import Vue from 'vue'

// import boostrap-vue module
// https://bootstrap-vue.js.org/docs/
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import youtube embed
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed);

// import VueResource module
import VueResource from 'vue-resource'
Vue.use(VueResource);

// import vue awesome
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon);

Vue.config.productionTip = false;

// import vuex store
import store from './store'
import App from './App'
import router from './router'


import VueProgressBar from 'vue-progressbar'
const options = {
  color: '#00fa8d',
  failedColor: '#c9000e',
  thickness: '2px',
  transition: {
    speed: '1s',
    opacity: '0.6s',
    termination: 1000
  },
  autoRevert: true,
  location: 'top',
  inverse: false,
  autoFinish: true
};

Vue.use(VueProgressBar, options);

export default new Vue({ // export the Vue instance
  el: '#app',
  router,
  store,
  render: h => h(App)
})