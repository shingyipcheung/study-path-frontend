import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import StudentParallel from '@/components/StudentParallel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'student',
      component: StudentParallel
    }
  ]
})
