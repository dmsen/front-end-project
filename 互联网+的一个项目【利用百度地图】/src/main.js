// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import '@/assets/icons/iconfont.css'
import VueParticles from 'vue-particles'
// import echarts from 'echarts'

import Video from 'video.js'
import 'video.js/dist/video-js.css'

import ViewUI from 'view-design';
// import style
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// import * as sock from "@/api/sock.js"
// Vue.prototype.socketApi = sock
import './theme/dark.less'
// require('@/theme/dark.less')
Vue.use(VueParticles);

// Vue.use(ViewUI, {
//   i18n: (key, value) => i18n.t(key, value)
// });


/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
Vue.prototype.$video = Video;
// Vue.prototype.$echarts = echarts;
/**
 * @description 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,

  store,
  render: h => h(App)
})
