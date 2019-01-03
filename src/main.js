import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import JsonExcel from 'vue-json-excel'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.component('downloadExcel', JsonExcel)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
