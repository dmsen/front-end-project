import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from './module/user'
import app from './module/app'
import monitor from './module/monitor'
import alarm from './module/alarm'

export default new Vuex.Store({
  state: {

  },
  mutations: {},
  actions: {
    //
  },
  modules: {
    user,
    app,
    monitor,
    alarm
  }
})
