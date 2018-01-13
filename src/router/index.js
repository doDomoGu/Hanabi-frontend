import Vue from 'vue'

import Router from 'vue-router'

import store from '../store'

import myRoutes from './my_routes'
// import NotFound404Routes from './NotFound404'

Vue.use(Router)

// console.warn('1. in router');

const routes = []

// 载入通用路由
for (const i in myRoutes) {
  routes.push(myRoutes[i])
}

// 最后载入404页面
// routes.push(NotFound404Routes);

// 声明router对象
const router = new Router({
  mode: 'history',
  routes
})

// console.warn('2. beforeEach router');

// console.log(router);

// 有登录状态  进一步判断路由权限
const authTrue = function (to, from, next) {
  if (to.path === '/logout') {
    // 登出操作
    store.dispatch('auth/Logout').then(() => {
      next({ path: '/login' })
    })
  } else if (to.path === '/login') {
    next({ path: '/' })
  } else {
    // if (router.meta..routePathsNotRequiredAuth.indexOf(to.path) !== -1) { // 在路由免登录白名单，直接进入
    if (!(to.meta.requireAuth)) {
      next()
    } else {
      // 权限验证
      let authFlag = false
      const requireRoles = to.meta.requireRoles
      const userRoles = store.getters['auth/roles']

      if (requireRoles === '*' || userRoles.includes('super_admin')) {
        authFlag = true
      } else {
        for (const i in requireRoles) {
          if (authFlag === false && userRoles.includes(requireRoles[i])) {
            authFlag = true
          }
        }
      }
      if (authFlag) {
        next()
      } else {
        next({ path: '/no-auth' })
      }
    }
  }
}

// 无登录状态 跳转至登录页面
const authFalse = function (to, from, next) {
  if (to.path !== '/login') {
    if (!(to.meta.requireAuth)) {
      next()
    } else {
      next({ path: '/login', query: { redirectUrl: to.fullPath }})
    }
  } else {
    next()
  }
}

// 路由切换时走判断流程
router.beforeEach((to, from, next) => {
  // vuex读取登录状态
  if (store.getters['auth/is_login']) {
    authTrue(to, from, next)
  } else {
    // LocalStorage读取token
    const tokenInLocalStorage = window.localStorage.__HANABI_AUTH_TOKEN__
    // token有值
    if (typeof (tokenInLocalStorage) === 'string' && tokenInLocalStorage !== '') {
      // 发送token验证请求
      store.dispatch('auth/CheckToken', tokenInLocalStorage).then(() => {
        if (store.getters['auth/is_login']) {
          // 验证token 成功
          authTrue(to, from, next)
        } else {
          // token错误 清空token
          authFalse(to, from, next)
        }
      })
    } else {
      // 未登录 也无token
      authFalse(to, from, next)
    }
  }
})

export default router
