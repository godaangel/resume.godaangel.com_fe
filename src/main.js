// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js' 

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

window.openSidebar;

iView.LoadingBar.config({
    // color: '#5cb85c',
    // failedColor: '#f0ad4e',
    height: 4
});
router.beforeEach((to, from, next) => {
  window.openSidebar = to.name;
  iView.LoadingBar.start();
  next();
});

router.afterEach((to, from) => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
