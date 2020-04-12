var millisecond = new Date().getTime();
var expiresTime = new Date(millisecond + 60 * 1000 * 300);

export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: expiresTime,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'http://47.97.117.142:18082/',
    // pro: 'http://47.97.117.142:18082/',
    dev: 'http://127.0.0.1:8000/',
    pro: 'http://127.0.0.1:8000/',
    //   dev: 'http://112.74.59.53/',
    //   pro: 'http://112.74.59.53/',
      // dev: 'http://47.97.117.142:18082/',
      // pro: 'http://47.97.117.142:18082/',
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
    registerName: 'register',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    // 'error-store': {
    //   showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
    //   developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    // }
  }
}
