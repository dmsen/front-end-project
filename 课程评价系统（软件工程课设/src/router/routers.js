import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 该页面对应的钥匙
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  showAlways: (boolean) 设置字段，true时即使只有一个子路由也会显示
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/login/login.vue')
  },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: 'register - 注册',
            hideInMenu: true,
            notCache: true
        },
        component: () => import('@/view/login/register.vue')
    },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: false,
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: false,
        title: '首页',
        icon: 'md-home',
      },
      component: () => import('@/view/home/home.vue')
    }]
  },


  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-person',
      title: '用户管理中心',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('userMenuLand') ? true : false,
      access: [1,0,2],
    },
    component: Main,
    children: [
        {
        path: 'management',
        name: 'management',
        meta: {
          title: '用户管理',
            access: [1,0,2],
        },
        component: () => import('@/view/user/management.vue')
      },
        // {
        //     path: 'mine11',
        //     name: 'mine11',
        //     meta: {
        //         title: '测试头像上传'
        //     },
        //     component: () => import('@/view/user/test_set.vue')
        // },
    ]
  },
  {
    path: '/course',
    name: 'course',
    meta: {
      icon: 'ios-settings',
      title: '课程管理',
      hideInMenu: sessionStorage.getItem('macMenuLand') ? true : false,
      showAlways: true,
      access: [1,0,2],
    },
    component: Main,
    children: [{
        path: 'courseMessage',
        name: 'courseMessage',
        meta: {
            title: '课程信息',
            access: [1,0,2],
        },
        component: () => import('@/view/course/courseMessage.vue')
      },
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
