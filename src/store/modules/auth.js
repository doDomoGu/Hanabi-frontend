import axios from '../../axios'

const state = {
  is_login: false,
  user_id: 0,
  user_info: {},
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
            commit('setUserId', { user_id: res.data.user_id })
            commit('setUserInfo', { user_info: res.data.user_info })
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
            access_token: token
          }
        }
      )
        .then((res) => {
          if (res.data && res.data.success) {
            commit('setToken', { token: res.data.token })
            commit('setLoginState')
            commit('setUserId', { user_id: res.data.user_id })
            commit('setUserInfo', { user_info: res.data.user_info })
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
      dispatch('my_room/Exit', null, { root: true }).then(() => {
        axios.delete(
          '/auth',
          {
            params: {
              access_token: this.getters['auth/token']
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
  user_id: state => state.user_id,
  user_info: state => state.user_info,
  is_login: state => state.is_login
}

const mutations = {
  setToken: (state, data) => {
    state.token = data.token
    if (data.forceUpdate) {
      localStorage.__HANABI_AUTH_TOKEN__ = data.token
    }
  },
  setLoginState: (state) => {
    state.is_login = true
  },
  setUserId: (state, data) => {
    state.user_id = data.user_id
  },
  setUserInfo: (state, data) => {
    state.user_info = data.user_info
  },
  clearLoginState: (state) => {
    state.is_login = false
    state.user_id = 0
    state.user_info = {}
    state.token = ''
    localStorage.removeItem('__HANABI_AUTH_TOKEN__')
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
