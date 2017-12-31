import Vue from 'vue'

import Router from 'vue-router'

import store from '../store'

import my_routes from './my_routes'
//import NotFound404Routes from './NotFound404'

Vue.use(Router);

//console.warn('1. in router');

let routes = [];

//载入通用路由
for(let i in my_routes){
  routes.push(my_routes[i]);
}

//最后载入404页面
//routes.push(NotFound404Routes);

//声明router对象
const router = new Router({
  mode:'history',
  routes
});

//console.warn('2. beforeEach router');

//console.log(router);


//有登录状态  进一步判断路由权限
let auth_true = function(to, from, next){
  if (to.path === "/logout") {
    //登出操作
    store.dispatch('auth/Logout').then(() => {
      next({path: '/login'});
    })
  }else if (to.path === "/login") {
    next({path: '/'});
  }else{
    //if (router.meta..routePathsNotRequiredAuth.indexOf(to.path) !== -1) { // 在路由免登录白名单，直接进入
    if(!(to.meta.requireAuth)){
      next();
    }else{
      //权限验证
      let authFlag = false;
      let requireRoles = to.meta.requireRoles;
      let userRoles = store.getters['auth/roles'];

      if(requireRoles === '*' || userRoles.includes('super_admin')){
        authFlag = true;
      }else{
        for(let i in requireRoles){
          if(authFlag === false && userRoles.includes(requireRoles[i])){
            authFlag = true;
          }
        }
      }
      if(authFlag){
        next();
      }else{
        next({path:'/no-auth'});
      }
    }
  }
};

//无登录状态 跳转至登录页面
let auth_false = function(to, from, next){
  if(to.path !=='/login'){
    if(!(to.meta.requireAuth)){
      next();
    }else{
      next({path: '/login',query:{redirectUrl:to.fullPath}});
    }
  }else{
    next();
  }
};

//路由切换时走判断流程
router.beforeEach((to, from, next) => {

  //vuex读取登录状态
  if(store.getters['auth/is_login']) {
    auth_true(to, from, next);
  } else {
    //LocalStorage读取token
    let tokenInLocalStorage = localStorage.__HANABI_AUTH_TOKEN__;
    //token有值
    if (typeof(tokenInLocalStorage) === 'string' && tokenInLocalStorage !== '') {
      //发送token验证请求
      store.dispatch('auth/CheckToken', tokenInLocalStorage).then(() => {
        if (store.getters['auth/is_login']) {
          //验证token 成功
          auth_true(to, from, next);
        } else {
          //token错误 清空token
          auth_false(to, from, next);
        }
      });
    } else {
      //未登录 也无token
      auth_false(to, from, next);
    }
  }
});

export default router;