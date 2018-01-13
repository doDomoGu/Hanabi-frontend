import axios from '../../axios'

const state = {
  isPlaying: false,
  logList: [],
  hostHands: [],
  guestHands: [],
  roundNum: -1,
  roundPlayerIsHost: -1,
  libraryCardsNum: -1,
  discardCardsNum: -1,
  cueNum: -1,
  chanceNum: -1,
  score: -1,
  successCards: []
}

const actions = {
  Start ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/start' + '?access_token=' + this.getters['auth/token']
      )
        .then((res) => {
          if (res.data.success) {
            commit('SetGameIsPlaying')
          // commit('SetRoomUser',res.data.data);
          } else {
          // commit('ClearRoomUser');
          }

          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  End ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/end' + '?access_token=' + this.getters['auth/token']
      )
        .then((res) => {
          if (res.data.success) {
            commit('ClearInfo')
            // commit('SetGameId',res.data.data.game_id);
            // commit('SetRoomUser',res.data.data);
          } else {
            // commit('ClearRoomUser');
          }

          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  GetInfo ({ commit }, param = {}) {
    if (!param.hasOwnProperty('mode')) { param.mode = 'all' }
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/get-info' + '?access_token=' + this.getters['auth/token'],
        param
      )
        .then((res) => {
          const _res = res.data
          if (_res.success) {
            if (!_res.data.no_update) {
              commit('SetGameIsPlaying')
              if (param.mode === 'all') {
                commit('SetGameInfo', _res.data.game)
                commit('SetCardInfo', _res.data.card)
                commit('SetLogInfo', _res.data.log)
              }
            }
          } else {
            commit('ClearInfo')
          }

          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /* IsInGame({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/is-in-game'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
          //if(this.getters['myGame/roundNum']<0 || res.data.data.update) {
            commit('SetGameIsPlaying');
          //}
        }else{
          commit('ClearInfo');
        }

        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },*/
  DoDiscard ({ commit }, cardSelectOrd) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-discard' + '?access_token=' + this.getters['auth/token'],
        {
          cardSelectOrd: cardSelectOrd
        }
      )
        .then((res) => {
          if (res.data.success) {
          // commit('SetGameId',res.data.data.game_id);
          } else {
          // commit('ClearInfo');
          }

          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  DoPlay ({ commit }, cardSelectOrd) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-play' + '?access_token=' + this.getters['auth/token'],
        {
          cardSelectOrd: cardSelectOrd
        }
      )
        .then((res) => {
          if (res.data.success) {
            // commit('SetGameId',res.data.data.game_id);
          } else {
            // commit('ClearInfo');
          }

          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  DoCue ({ commit }, [cardSelectOrd, cueType]) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-cue' + '?access_token=' + this.getters['auth/token'],
        {
          cardSelectOrd: cardSelectOrd,
          cueType: cueType
        }
      )
        .then((res) => {
          if (res.data.success) {
            // commit('SetGameId',res.data.data.game_id);
          } else {
            // commit('ClearInfo');
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
  isPlaying: state => state.isPlaying,
  logList: state => state.logList,
  logList2: state => {
    const tmp = []
    for (const i in state.logList) {
      tmp.unshift(state.logList[i])
    }
    return tmp
  },
  hostHands: state => state.hostHands,
  guestHands: state => state.guestHands,
  roundNum: state => state.roundNum,
  roundPlayerIsHost: state => state.roundPlayerIsHost,
  libraryCardsNum: state => state.libraryCardsNum,
  discardCardsNum: state => state.discardCardsNum,
  cueNum: state => state.cueNum,
  chanceNum: state => state.chanceNum,
  score: state => state.score,
  successCards: state => state.successCards
}

const mutations = {
  SetGameIsPlaying (state) {
    state.isPlaying = true
  },
  SetLogInfo (state, data) {
    state.logList = data
  },
  SetCardInfo (state, data) {
    state.hostHands = data.hostHands
    state.guestHands = data.guestHands
    state.libraryCardsNum = data.libraryCardsNum
    state.discardCardsNum = data.discardCardsNum
    state.cueNum = data.cueNum
    state.chanceNum = data.chanceNum
    state.score = data.score
    state.successCards = data.successCards
  },
  SetGameInfo (state, data) {
    state.roundNum = data.roundNum
    state.roundPlayerIsHost = data.roundPlayerIsHost
  },
  ClearInfo (state) {
    state.isPlaying = false
    state.logList = []
    state.hostHands = []
    state.guestHands = []
    state.roundNum = -1
    state.roundPlayerIsHost = false
    state.libraryCardsNum = -1
    state.discardCardsNum = -1
    state.cueNum = -1
    state.chanceNum = -1
    state.score = -1
    state.successCards = []
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
