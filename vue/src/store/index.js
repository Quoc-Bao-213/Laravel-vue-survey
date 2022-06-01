import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN')
        }
    },
    getters: {},
    actions: {
        register({ commit }, user) {
            return axiosClient.post('/register', user)
                .then((data) => {
                    commit('setUser', data);
                    return data;
                })
        },
        login({ commit }, user) {
            return axiosClient.post('/login', user)
                .then((data) => {
                    commit('setUser', data);
                    return data;
                })
        }
    },
    mutations: {
        logout: (state) => {
          state.user.data = {};
          state.user.token = null;
        },
        setUser: (state, userData) => {
          state.user.token = userData.data.token;
          state.user.data = userData.data.user;
          sessionStorage.setItem('TOKEN', userData.data.token);
        }
    },
    modules: {}
})

export default store;
