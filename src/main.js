import 'babel-polyfill' //ES6转ES5兼容
import $ from 'jquery' //jquery
import axios from 'axios' //axios
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Constant from '@/assets/js/Constant.js'
import Common from '@/assets/js/Common.js'
import store from '@/assets/js/store/store.js' //Vuex
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} from "vuex";
import {
  Loading
} from 'element-ui'

Vue.config.productionTip = false

import '@/assets/css/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css'

//element-ui
Vue.use(ElementUI);

global.$Loading = Loading
global.$Constant = Constant;
global.$axios = axios
global.$Common = Common
global.$mapState = mapState
global.$mapActions = mapActions
global.$mapGetters = mapGetters
global.$mapMutations = mapMutations

$Common.axios.interceptors();

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
