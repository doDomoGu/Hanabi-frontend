import axios from '../../axios'

const state = {
  count: -1,
  list: []
}

const actions = {
  List ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(
        '/room',
        {
          params: {
            accessToken: this.getters['auth/token']
          }
        }
      )
        .then((res) => {
          if (res.data) {
            commit('SetRoomList', res.data)
          } else {
            commit('ClearRoomList')
          }
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const getters = {
  list: state => state.list,
  count: state => state.count
}

const mutations = {
  SetRoomList (state, data) {
    state.list = data
  },
  ClearRoomList (state) {
    state.list = []
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
