import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/views/Register'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Subject from '@/views/Subject'
import Admin from '@/views/Admin';
import store from './store'

//TODO add Subject component which has subject data and possibility for user to add commend and reviews.

Vue.use(Router);

const router = new Router({
    mode: 'history', // uris without hashes #, see https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
    routes: [
        {path: '/register', component: Register},
        {path: '/login', component: Login},
        {
            path: '/',
            component: Home,
            meta: {
                requiresAuth: true //TODO: set to false for fast debug
            }
        },
        {
            path: '/admin',
            component: Admin,
            meta: {
                requiresAuth: true //TODO: set to false for fast debug
            }
        },
        {
            path: '/subject',
            component: Subject,
            meta: {
                requiresAuth: true //TODO: set to false for fast debug
            }
        },

        // otherwise redirect to home
        {path: '*', redirect: '/'}
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.isLoggedIn) {
            next({
                path: '/login'
            })
        } else {
            next();
        }
    } else {
        next(); // make sure to always call next()!
    }
});

export default router;
