// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import boostrap-vue module
// https://bootstrap-vue.js.org/docs/
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import VueResource module
import VueResource from 'vue-resource'
Vue.use(VueResource);

// import vue awesome
import 'vue-awesome/icons'
/* Register component with one of 2 methods */
import Icon from 'vue-awesome/components/Icon'
// globally (in your main .js file)
Vue.component('icon', Icon)

// not to use Vuetify because of a bug
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// Vue.use(Vuetify);

// allow cross origin http traffics
Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
Vue.http.headers.common['Accept'] = 'application/json, text/plain, */*'
Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin'

Vue.config.productionTip = false

// import vuex store
import store from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
