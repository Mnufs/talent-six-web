import Vue from 'vue';
import Vuex from 'vuex';
import chat from './modules/chat'
import friend from './modules/friend'

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    chat,
    friend
  }
});

export default store;
