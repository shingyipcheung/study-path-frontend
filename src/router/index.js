import Vue from 'vue'
import Router from 'vue-router'

const HomeView = () => import('@/views/HomeView');
const ReportView = () => import('@/views/ReportView')
const LearningView = () => import('@/views/LearningView');
const VideoView = () => import('@/views/VideoView');
const ProblemView = () => import('@/views/ProblemView');

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        keepAlive: true,
        scrollToTop: false
      }
    },
    {
      path: '/report/:id',
      name: 'report',
      component: ReportView,
      meta: {
        keepAlive: false,
        scrollToTop: true
      },
      props: true
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView,
      meta: {
        keepAlive: false,
        scrollToTop: true
      },
      props: true,
      children: [{
        path: ':concept',
        components: {
          videos: VideoView,
          problems: ProblemView,
        },
      }]
    },
    // {
    //   path: '/videos/:concept',
    //   name: 'videos',
    //   component: VideoView,
    //   meta: {
    //     keepAlive: false,
    //     scrollToTop: true
    //   },
    //   props: true
    // },
    // {
    //   path: '/problems/:concept',
    //   name: 'problems',
    //   component: ProblemView,
    //   meta: {
    //     keepAlive: false,
    //     scrollToTop: true
    //   },
    //   props: true
    // },
  ],
})
