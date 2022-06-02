import { createStore } from "vuex";
import axiosClient from "../axios";

const tmpSurseys = [
    {
        id: 100,
        title: 'title',
        slug: 'slug',
        status: 'draft',
        image: null,
        description: "My name is Cyrus",
        created_at: "2022-02-06 18:00:00",
        updated_at: "2022-02-06 18:00:00",
        expire_date: "2022-02-30 18:00:00",
        questions: [
            {
                id: 1,
                type: "select",
                question: "Hello world",
                description: null,
                data: {
                    options: [
                        { uuid: "asdasdasdsasdasd", text: "A" },
                        { uuid: "asdaqwesdsasdasd", text: "B" },
                        { uuid: "adsasdasdasdadsd", text: "C" },
                        { uuid: "gfhgfhghfghsdasd", text: "D" },
                    ]
                }
            }
        ]
    }
];

const store = createStore({
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN')
        },
        surveys: [...tmpSurseys],
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
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
        },
        logout({ commit }) {
            return axiosClient.post('/logout')
                .then(response => {
                    commit('logout')
                    return response;
                })
        }
    },
    mutations: {
        logout: (state) => {
            state.user.data = {};
            state.user.token = null;
            sessionStorage.removeItem('TOKEN');
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
