import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import NotFound from './pages/NotFound.vue'
import actuator from './pages/actuator/actuator'

Vue.use(Router);

export default new Router({
    routes: [...actuator,
        {path: '/', name: 'home', component: Home},
        {path: '/404', component: NotFound},
        {path: '*', redirect: '/404'}
    ]
})
