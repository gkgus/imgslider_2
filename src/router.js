import Vue from 'vue'
import Router from 'vue-router'
import imgUpload from './components/imgUpload.vue'
import slideShow from './components/slideShow.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'imgUpload',
      component: imgUpload
    },
    {
      path: '/slideShow',
      name: 'slideShow',
      component:slideShow
    }
  ]
})
