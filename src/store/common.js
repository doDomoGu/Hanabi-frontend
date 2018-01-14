const state = {
  title: 'Hanabi',
  titleSuffix: 'Hanabi'
}
const actions = {
  SetTitle ({ commit }, data) {
    commit('setTitle', data)
  },
  SetTitle2 ({ commit }, data) {
    if (data !== this.getters['common/titleSuffix']) {
      data = this.getters['common/titleSuffix'] + ' _ ' + data
    }
    commit('setTitle', data)
  }
}

const getters = {
  title: state => state.title,
  titleSuffix: state => state.titleSuffix
}

const mutations = {
  setTitle: (state, data) => {
    state.title = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
