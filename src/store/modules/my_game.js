import axios from '../../axios'

const state = {
  is_playing:false,
  log_list:[],
  host_hands:[],
  guest_hands:[],
  round_num:-1,
  round_player_is_host:-1,
  library_cards_num:-1,
  discard_cards_num:-1,
  cue_num:-1,
  chance_num:-1,
  score:-1,
  success_cards:[]
};

const actions = {
  Start({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/start'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
          commit('SetGameIsPlaying');
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
  End({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/end'+'?access_token='+this.getters['auth/token']
      )
        .then((res) => {
          if(res.data.success){
            commit('ClearInfo')
            //commit('SetGameId',res.data.data.game_id);
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
  GetGameInfo({commit}){
    let _param = {};
    if(this.getters['my_game/round_num']<0){
      _param.forceUpdate = true;
    }
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/get-info'+'?access_token='+this.getters['auth/token'],_param
      )
      .then((res) => {
        if(res.data.success){
          if(!res.data.data.no_update){
            commit('SetGameInfo',res.data.data.game);
            commit('SetCardInfo',res.data.data.card);
            commit('SetLogInfo',res.data.data.log);
          }

        }else{
          //commit('ClearInfo');
        }

        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },
  IsInGame({commit}){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/is-in-game'+'?access_token='+this.getters['auth/token']
      )
      .then((res) => {
        if(res.data.success){
          //if(this.getters['my_game/round_num']<0 || res.data.data.update) {
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
  },
  DoDiscard({commit},cardSelectOrd){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-discard'+'?access_token='+this.getters['auth/token'],
        {
          cardSelectOrd:cardSelectOrd
        }
      )
      .then((res) => {
        if(res.data.success){
          //commit('SetGameId',res.data.data.game_id);
        }else{
          //commit('ClearInfo');
        }

        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },
  DoPlay({commit},cardSelectOrd){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-play'+'?access_token='+this.getters['auth/token'],
        {
          cardSelectOrd:cardSelectOrd
        }
      )
        .then((res) => {
          if(res.data.success){
            //commit('SetGameId',res.data.data.game_id);
          }else{
            //commit('ClearInfo');
          }

          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  DoCue({commit},[cardSelectOrd,cue_type]){
    return new Promise((resolve, reject) => {
      axios.post(
        '/my-game/do-cue'+'?access_token='+this.getters['auth/token'],
        {
          cardSelectOrd:cardSelectOrd,
          cueType:cue_type
        }
      )
        .then((res) => {
          if(res.data.success){
            //commit('SetGameId',res.data.data.game_id);
          }else{
            //commit('ClearInfo');
          }

          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

};

const getters = {
  is_playing : state=>state.is_playing,
  log_list : state=>state.log_list,
  log_list2 : state=>{
    let list_tmp=[]
    for(let i in state.log_list){
      list_tmp.unshift(state.log_list[i]);
    }
    return list_tmp;
  },
  host_hands : state=>state.host_hands,
  guest_hands : state=>state.guest_hands,
  round_num : state=>state.round_num,
  round_player_is_host : state=>state.round_player_is_host,
  library_cards_num : state=>state.library_cards_num,
  discard_cards_num : state=>state.discard_cards_num,
  cue_num : state=>state.cue_num,
  chance_num : state=>state.chance_num,
  score : state=>state.score,
  success_cards : state=>state.success_cards
};

const mutations = {
  SetGameIsPlaying(state){
    state.is_playing = true;
  },
  SetLogInfo(state,data){
    state.log_list = data;
  },
  SetCardInfo(state,data){
    state.host_hands = data.host_hands;
    state.guest_hands = data.guest_hands;
    state.library_cards_num = data.library_cards_num;
    state.discard_cards_num = data.discard_cards_num;
    state.cue_num = data.cue_num;
    state.chance_num = data.chance_num;
    state.score = data.score;
    state.success_cards = data.success_cards;
  },
  SetGameInfo(state, data){
    state.round_num = data.round_num;
    state.round_player_is_host = data.round_player_is_host;
  },
  ClearInfo(state){
    state.is_playing = false;
    state.log_list = [];
    state.host_hands = [];
    state.guest_hands = [];
    state.round_num = -1;
    state.round_player_is_host = false;
    state.library_cards_num = -1;
    state.discard_cards_num = -1;
    state.cue_num = -1;
    state.chance_num = -1;
    state.score = -1;
    state.success_cards = [];
  },
};

export default {
    namespaced:true,
    state,
    actions,
    getters,
    mutations
}
