import Vue from 'vue'
import Vuex from 'vuex'

import common from './common';

import auth from './modules/auth';

import room from './modules/room';

import my_room from './modules/my_room';
import my_game from './modules/my_game';



Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        common,
        auth,
        room,
        my_room,
        my_game
    }
});



