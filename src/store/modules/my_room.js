import axios from '../../axios'

const state = {
  room_id:-1,
  is_host:false,
  host_player:{
    id:-1,
    username:null,
    name:null
  },
  guest_player:{
    id:-1,
    username:null,
    name:null
  },
};

const actions = {
  Enter({commit},room_id){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/enter'+'?access_token='+this.getters['auth/token'],
        {
          room_id:room_id
        }
      )
      .then((res) => {
        if(res.data.success){
          commit('SetRoomId',room_id);
        }
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },
  Exit({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/exit'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
        }
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },
  IsInRoom({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/is-in-room'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {

        if(res.data.success){
          commit('SetRoomId',res.data.data.room_id);
          commit('SetIsHost',res.data.data.is_host);
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
  },
  GetRoomInfo({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-room/get-info'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
          commit('SetRoomPlayer',res.data.data);
        }else{
          commit('ClearRoomPlayer');
        }
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },
  DoReady({commit}){
    return new Promise((resolve, reject) => {

      axios.post(
        '/my-room/do-ready'+'?access_token='+this.getters['auth/token']
      )
        .then((res) => {

          if(res.data.success){
            //commit('SetRoomUser',res.data.data);
          }else{
            //commit('ClearRoomUser');
          }

          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
};

const getters = {
  room_id:state=>state.room_id,
  is_host:state=>state.is_host,
  host_player:state=>state.host_player,
  guest_player:state=>state.guest_player,
};

const mutations = {
  SetRoomId(state, room_id){
    state.room_id = room_id;
  },
  SetIsHost(state, is_host){
    state.is_host = is_host;
  },
  SetRoomPlayer(state, data){
    state.host_player = data.host_player;
    state.guest_player = data.guest_player;
  },
  ClearIsHost(state){
    state.is_host = false;
  },
  ClearRoomId(state){
    state.room_id = -1;
  },
  ClearRoomPlayer(state){
    state.host_player = {
      id:-1,
      username:null,
      name:null
    };
    state.guest_player = {
      id:-1,
      username:null,
      name:null
    };
  }
};

export default {
    namespaced:true,
    state,
    actions,
    getters,
    mutations
}
