import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import dict from './modules/dict';
import cpnt from "./modules/cpnt"
import codeValue from './modules/codeValue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 状态
        token: '',
        department: {},
        storgeList: []
    },
    mutations: {
        // 改变方法
        departmentSet (state, v) {
            state.department = v
        },
        storgeListSet (state, v) {
            let storgeFlag = state.storgeList.find(item => item.path == v.path)
            if (storgeFlag) {
                state.storgeList.forEach(item => {
                    item = v
                })

            } else {
                state.storgeList.push(v)
            }
            console.log(state.storgeList)
        },
        //更新token
		setToken(state, token){
			state.token = token;
			localStorage.setItem('token', token);
		},
    },
    actions: {
        departmentAct ({ commit }, userAppInfo) {
            commit('departmentSet', userAppInfo)
        },
        storgeListAct ({ commit }, dataInfo) {
            commit('storgeListSet', dataInfo)
        },
        
    },
    modules: {
        app,
        user,
        dict,
        cpnt,
        codeValue,
    }
});

export default store;
