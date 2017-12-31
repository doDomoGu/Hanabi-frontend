const state = {
  title:'Hanabi',
  title_suffix:'Hanabi'
};
const actions = {
  SetTitle({ commit }, data) {
      commit('set_title',data);
  },
  SetTitle2({ commit }, data) {
    if(data!=this.getters['common/title_suffix']){
      data = this.getters['common/title_suffix'] + ' _ ' +data;
    }
    commit('set_title',data);
  },
};

const getters = {
    title: state => state.title,
    title_suffix: state => state.title_suffix,
};

const mutations = {
    set_title: (state, data) => {
        state.title = data;
    },
};

export default {
    namespaced:true,
    state,
    actions,
    getters,
    mutations
}
