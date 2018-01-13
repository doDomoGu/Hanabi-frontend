import axios from '../../axios'

const state = {
  isLogin: false,
  userId: 0,
  userInfo: {},
  token: ''
}

const actions = {
  Login ({ commit }, [username, password]) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/auth',
        {
          username: username,
          password: password
        }
      )
        .then((res) => {
          if (res.data && res.data.success) {
            commit('setToken', { token: res.data.token, forceUpdate: true })
            commit('setLoginState')
            commit('setUserId', { userId: res.data.userId })
            commit('setUserInfo', { userInfo: res.data.userInfo })
          }
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  CheckToken ({ commit }, token) {
    return new Promise((resolve, reject) => {
      axios.get(
        '/auth',
        {
          params: {
            accessToken: token
          }
        }
      )
        .then((res) => {
          if (res.data && res.data.success) {
            commit('setToken', { token: res.data.token })
            commit('setLoginState')
            commit('setUserId', { userId: res.data.userId })
            commit('setUserInfo', { userInfo: res.data.userInfo })
          } else {
          // 提交的token 错误
            commit('clearLoginState')
          }
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  Logout ({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      dispatch('myRoom/Exit', null, { root: true }).then(() => {
        axios.delete(
          '/auth',
          {
            params: {
              accessToken: this.getters['auth/token']
            }
          }
        )
          .then((res) => {
            if (res.data && res.data.success) {
              commit('clearLoginState')
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    })
  }
}

const getters = {
  token: state => state.token,
  userId: state => state.userId,
  userInfo: state => state.userInfo,
  isLogin: state => state.isLogin
}

const mutations = {
  setToken: (state, data) => {
    state.token = data.token
    if (data.forceUpdate) {
      window.localStorage.__HANABI_AUTH_TOKEN__ = data.token
    }
  },
  setLoginState: (state) => {
    state.isLogin = true
  },
  setUserId: (state, data) => {
    state.userId = data.userId
  },
  setUserInfo: (state, data) => {
    state.userInfo = data.userInfo
  },
  clearLoginState: (state) => {
    state.isLogin = false
    state.userId = 0
    state.userInfo = {}
    state.token = ''
    window.localStorage.removeItem('__HANABI_AUTH_TOKEN__')
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
