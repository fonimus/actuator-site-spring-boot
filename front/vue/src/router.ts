import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {path: '/', name: 'home', component: Home},
        {
            path: '/info', name: 'info',
            component: () => import(/* webpackChunkName: "info" */ './views/Info.vue'),
        },
        {
            path: '/health',
            name: 'health',
            component: () => import(/*webpackChunkName: "health" */ './views/Health.vue'),
        },
        {
            path: '/metrics',
            name: 'metrics',
            component: () => import(/*webpackChunkName: "metrics" */ './views/Metrics.vue'),
        },
        {path: '/env', name: 'env', component: () => import(/*webpackChunkName: "env" */ './views/Env.vue')},
        {
            path: '/mappings',
            name: 'mappings',
            component: () => import(/*webpackChunkName: "mappings" */ './views/Mappings.vue'),
        },
        {path: '/beans', name: 'beans', component: () => import(/*webpackChunkName: "beans" */ './views/Beans.vue')},
        {
            path: '/configprops',
            name: 'configprops',
            component: () => import(/*webpackChunkName: "configprops" */ './views/ConfigProps.vue'),
        },
        {
            path: '/loggers',
            name: 'loggers',
            component: () => import(/*webpackChunkName: "loggers" */ './views/Loggers.vue'),
        },
        {
            path: '/threaddump',
            name: 'threaddump',
            component: () => import(/*webpackChunkName: "threaddump" */ './views/ThreadDump.vue'),
        },
        {
            path: '/conditions',
            name: 'conditions',
            component: () => import(/*webpackChunkName: "conditions" */ './views/Conditions.vue'),
        },
        {
            path: '/httptrace',
            name: 'httptrace',
            component: () => import(/*webpackChunkName: "httptrace" */ './views/HttpTrace.vue'),
        },
        {
            path: '/scheduledtasks',
            name: 'scheduledtasks',
            component: () => import(/*webpackChunkName: "scheduledtasks" */ './views/ScheduledTasks.vue'),
        },
        {
            path: '/auditevents',
            name: 'auditevents',
            component: () => import(/*webpackChunkName: "auditevents" */ './views/AuditEvents.vue'),
        },
        {
            path: '/404',
            name: 'notfound',
            component: () => import(/*webpackChunkName: "notfound" */ './views/NotFound.vue'),
        },
        {path: '*', redirect: '/404'},
    ],
});
