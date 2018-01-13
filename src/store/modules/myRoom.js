import axios from '../../axios'

const state = {
  roomId: -1,
  isHost: false,
  hostPlayer: {
    id: -1,
    username: null,
    name: null
  },
  guestPlayer: {
    id: -1,
    username: null,
    name: null
  },
  isReady: false
}

const actions = {
  Enter ({ commit }, roomId) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/enter' + '?access_token=' + this.getters['auth/token'],
        {
          roomId: roomId
        }
      )
        .then((res) => {
        /* if(res.data.success){
          commit('SetRoomId',roomId);
        }*/
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  Exit ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/exit' + '?access_token=' + this.getters['auth/token']
      )
        .then((res) => {
        /* if(res.data.success){
        }*/
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /* IsInRoom({commit}){
    let _param = {};
    if(this.getters['myRoom/hostPlayer'].id<0){
      _param.forceUpdate = true;
    }

    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/is-in-room'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
          commit('SetRoomId',res.data.data.roomId);
          commit('SetIsHost',res.data.data.isHost);
        }else{
          commit('ClearRoomId');
          commit('ClearIsHost');
        }

        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },*/
  /*
    获取玩家的房间信息
    mode(string)  :   all    : 完整数据
                      simple : 只有isInRoom数据
    force(boolean): 是否强制更新数据
   */
  GetInfo ({ commit }, param = {}) {
    if (!param.hasOwnProperty('mode')) { param.mode = 'all' }

    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/get-info' + '?access_token=' + this.getters['auth/token'],
        param
      )
        .then((res) => {
          const _res = res.data
          if (_res.success) {
            if (!_res.data.no_update) {
              commit('SetRoomId', _res.data.roomId)
              if (param.mode === 'all') {
                commit('SetIsHost', _res.data.isHost)
                commit('SetRoomPlayer', _res.data)
              }
            }
          } else {
            commit('ClearRoomId')
            commit('ClearIsHost')
            commit('ClearRoomPlayer')
          }
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  DoReady ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/do-ready' + '?access_token=' + this.getters['auth/token']
      )
        .then((res) => {
          if (res.data.success) {
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
  }
}

const getters = {
  roomId: state => state.roomId,
  isHost: state => state.isHost,
  hostPlayer: state => state.hostPlayer,
  guestPlayer: state => state.guestPlayer,
  isReady: state => state.isReady
}

const mutations = {
  SetRoomId (state, roomId) {
    state.roomId = roomId
  },
  SetIsHost (state, isHost) {
    state.isHost = isHost
  },
  SetRoomPlayer (state, data) {
    state.hostPlayer = data.hostPlayer
    state.guestPlayer = data.guestPlayer
    state.isReady = data.isReady
  },

  ClearIsHost (state) {
    state.isHost = false
  },
  ClearRoomId (state) {
    state.roomId = -1
  },
  ClearRoomPlayer (state) {
    state.hostPlayer = {
      id: -1,
      username: null,
      name: null
    }
    state.guestPlayer = {
      id: -1,
      username: null,
      name: null
    }
    state.isReady = false
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
