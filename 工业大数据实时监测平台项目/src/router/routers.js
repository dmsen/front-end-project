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
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/home')
    }]
  },
  {
    path: '/monitor',
    name: 'monitor',
    meta: {
      icon: 'md-planet',
      title: '实时监控看板',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('monitorMenuLand') ? true : false,
      access: [1,0],
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'index',
        meta: {
          title: '监控页'
        },
        component: () => import('@/view/monitor/index.vue')
      },
      {
        path: 'borad',
        name: 'borad',
        meta: {
          title: '工作台',
        },
        component: () => import('@/view/monitor/testLin.vue')
      },
    ]
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      icon: 'md-git-branch',
      title: '数据分析',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('analysisMenuLand') ? true : false,
      access: [1,0],
    },
    component: Main,
    children: [{
        path: 'history',
        name: 'history',
        meta: {
          title: '历史记录'
        },
        component: () => import('@/view/analysis/history.vue')
      },
      {
        path: 'hty',
        name: 'hty',
        meta: {
          title: '历史趋势分析'
        },
        component: () => import('@/view/analysis/htyData.vue')
      },
      {
        path: 'contrast',
        name: 'contrast',
        meta: {
          title: '数据对比'
        },
        component: () => import('@/view/analysis/contrast.vue')
      },
    ]
  },
  {
    path: '/alarm',
    name: 'alarm',
    meta: {
      icon: 'md-notifications-outline',
      title: '异常报警',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('alarmMenuLand') ? true : false,
      access: [1,0],
    },
    component: Main,
    children: [{
        path: 'record',
        name: 'record',
        meta: {
          title: '异常记录',
            access: [1,0],
        },
        component: () => import('@/view/alarm/record.vue')
      },
      {
        path: 'solution',
        name: 'solution',
        meta: {
          title: '解决方案'
        },
        component: () => import('@/view/alarm/solution.vue')
      },
      {
        path: 'code',
        name: 'code',
        meta: {
          title: '异常码'
        },
        component: () => import('@/view/alarm/code.vue')
      },
      {
        path: 'codes',
        name: 'codes',
        meta: {
          title: '组合码'
        },
        component: () => import('@/view/alarm/codes.vue')
      },
      {
        path: 'process',
        name: 'process',
        meta: {
          title: '故障处理'
        },
        component: () => import('@/view/alarm/process.vue')
      },
        {
            path: 'history',
            name: 'alarmHistory',
            meta: {
                title: '历史操作'
            },
            component: () => import('@/view/alarm/alarmHistory.vue')
        },
    ]
  },
  {
    path: '/repairProcess',
    name: 'repairProcess',
    meta: {
      icon: 'md-hammer',
      title: '维修流程',
      showAlways: true,
      hideInMenu: localStorage.getItem('repairMenuLand') ? true : false
    },
    component: Main,
    children: [{
        path: 'repair',
        name: 'repair',
        meta: {
          title: '维修保养',
        },
        component: () => import('@/view/repair/repair.vue')
      },
      {
        path: 'inspection',
        name: 'inspection',
        meta: {
          title: '巡检业务',
        },
        component: () => import('@/view/repair/inspection.vue')
      },
      {
        path: 'repairRecord',
        name: 'repairRecord',
        meta: {
          title: '维修记录',
        },
        component: () => import('@/view/repair/record.vue')
      },
      {
        path: 'onlineExpert',
        name: 'onlineExpert',
        meta: {
          title: '在线专家',
        },
        component: () => import('@/view/repair/onlineExpert.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-person',
      title: '个人中心',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('userMenuLand') ? true : false,
      access: [1,0,2],
    },
    component: Main,
    children: [{
        path: 'mine',
        name: 'mine',
        meta: {
          title: '个性化'
        },
        component: () => import('@/view/user/set.vue')
      }, {
        path: 'management',
        name: 'management',
        meta: {
          title: '用户管理'
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
      // {
      //   path: 'power',
      //   name: 'power',
      //   meta: {
      //     title: '自定义菜单'
      //   },
      //   component: () => import('@/view/user/power.vue')
      // },
    ]
  },
  {
    path: '/equipment',
    name: 'equipment',
    meta: {
      icon: 'ios-settings',
      title: '设备管理',
      hideInMenu: sessionStorage.getItem('macMenuLand') ? true : false,
      showAlways: true,
      access: [1,0],
    },
    component: Main,
    children: [{
        path: 'macType',
        name: 'macType',
        meta: {
          title: '设备类型'
        },
        component: () => import('@/view/equipment/macType.vue')
      },
      {
        path: 'mac',
        name: 'mac',
        meta: {
          title: '机器管理'
        },
        component: () => import('@/view/equipment/mac.vue')
      },
      // {
      //   path: 'macRange',
      //   name: 'macRange',
      //   meta: {
      //     title: '通用量程配置'
      //   },
      //   component: () => import('@/view/equipment/macRange.vue')
      // },
    ]
  },
  {
    path: '/gateway',
    name: 'gateway',
    meta: {
      icon: 'md-cloud-outline',
      title: '网关与监测点管理',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('iopMenuLand') ? true : false,
      access: [1,0],
    },
    component: Main,
    children: [{
        path: 'config',
        name: 'config',
        meta: {
          title: '监测点配置'
        },
        component: () => import('@/view/gw/config.vue')
      },
      {
        path: 'iops',
        name: 'iops',
        meta: {
          title: '监测点组管理'
        },
        component: () => import('@/view/gw/iops.vue')
      },
    ]
  },
  {
    path: '/files',
    name: 'files',
    meta: {
      icon: 'md-document',
      title: '档案管理',
      showAlways: true,
      hideInMenu: sessionStorage.getItem('archiveMenuLand') ? true : false,
      access: [1,0,2],
    },
    component: Main,
    children: [{
        path: 'mechanism',
        name: 'mechanism',
        meta: {
          title: '机构档案',
          access: [1,0,2],
        },
        component: () => import('@/view/files/mechanism.vue')
      },
      {
        path: 'customer',
        name: 'customer',
        meta: {
          title: '客户档案',
          access: [1,0],
        },
        component: () => import('@/view/files/customer.vue')
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
