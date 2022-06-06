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
        currentSurvey: {
            loading: false,
            data: {}
        },
        surveys: [...tmpSurseys],
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    },
    getters: {},
    actions: {
        getSurvey({ commit }, id) {
            commit("setCurrentSurveyLoading", true);
            return axiosClient
                .get(`/survey/${id}`)
                .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    commit("setCurrentSurveyLoading", false);
                    return res;
                })
                .catch((err) => {
                    commit("setCurrentSurveyLoading", false);
                    throw err;
                });
        },
        saveSurvey({ commit }, survey) {
            delete survey.image_url;
            let response;

            if (survey.id) {
                response = axiosClient
                    .put(`/survey/${survey.id}`, survey)
                    .then((res) => {
                        commit("setCurrentSurvey", res.data);
                        return res;
                    });
            } else {
                response = axiosClient.post("/survey", survey).then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                });
            }

            return response;
        },
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
        setCurrentSurveyLoading: (state, loading) => {
            state.currentSurvey.loading = loading;
        },
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
        },
        // saveSurvey: (state, survey) => {
        //     state.surveys = [...state.surveys, survey.data];
        // },
        // updateSurvey: (state, survey) => {
        //     state.surveys = state.surveys.map((s) => {
        //         if (s.id == survey.data.id) {
        //             return survey.data;
        //         }
        //         return s;
        //     });
        // },
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
