import Main from '../views/layouts/main'

import Index from '../views/index/Index'
import Login from '../views/index/Login'
import Register from '../views/index/Register'

import NoAuth from '../views/other/NoAuth'
import NotFound404 from '../views/other/NotFound404'

import Room from '../views/room/Index'
import Game from '../views/game/Index'

var routes = [{
  path: '/',
  component: Main,
  /* meta: {
    requireAuth: true,
    requireRoles: '*'
  },*/
  children: [
    {
      path: '',
      name: '首页',
      component: Index
      /* meta: {
        requireAuth: true,
        requireRoles: '*'
      }*/
    },
    {
      path: 'room',
      name: '房间',
      component: Room,
      meta: {
        requireAuth: true,
        requireRoles: '*'
      }
    },
    {
      path: 'game',
      name: '游戏中',
      component: Game,
      meta: {
        requireAuth: true,
        requireRoles: '*'
      }
    },
    {
      path: 'no-auth',
      name: '没有权限',
      component: NoAuth,
      meta: {
        requireAuth: true,
        requireRoles: '*'
      }
    },
    {
      path: 'login',
      component: Login,
      name: '登录页'
    },
    {
      path: 'register',
      component: Register,
      name: '注册页'
    },
    {
      path: '*',
      name: '404',
      component: NotFound404
    }
  ]
},
{
  path: 'logout',
  name: '登出',
  meta: {
    requireAuth: true,
    requireRoles: '*'
  }
}]

export default routes
