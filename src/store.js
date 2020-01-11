import Vue from 'vue'
import Vuelidate from 'vuelidate';

import Vuex from 'vuex'
import api from './components/backend-api'

Vue.use(Vuex);
Vue.use(Vuelidate);

export default new Vuex.Store({
    state: {
        loginSuccess: false,
        loginError: false,
        userName: null,
        userPass: null,
        userId: null,
        token: null,
        isAdmin: false
    },
    mutations: {
        login_success(state, payload) {
            state.loginSuccess = true;
            state.userName = payload.userName;
            state.userPass = payload.userPass;
            state.token = payload.token;
            state.userId = payload.userId;
            state.isAdmin = payload.isAdmin;
        },
        login_error(state, payload) {
            state.loginError = true;
            state.userName = payload.userName;
        },
        logout(state){
            state.loginSuccess = false;
            state.userName = null;
            state.userPass = null;
            state.token = null;
            state.userId = null;
            state.isAdmin = false;
        }
    },
    actions: {
        login({commit}, {user, password}) {
            return new Promise((resolve, reject) => {
                console.log("Accessing backend with user: '" + user);
                api.getSecured(user, password)
                    .then(response => {
                        console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                        if (response.status === 200) {
                            console.log("Login successful");
                            // place the loginSuccess state into our vuex store
                            commit('login_success', {
                                userName: user,
                                userPass: password,
                                token: response.data.token,
                                userId: response.data.id,
                                isAdmin: response.data.admin
                            });
                        }
                        resolve(response)
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                        // place the loginError state into our vuex store
                        commit('login_error', {
                            userName: user
                        });
                        reject("Invalid credentials!")
                    })
            })
        },
        logout({commit}){
            commit('logout');
        }
    },
    getters: {
        isLoggedIn: state => state.loginSuccess,
        hasLoginErrored: state => state.loginError,
        getUserName: state => state.userName,
        getUserPass: state => state.userPass
    }
})
