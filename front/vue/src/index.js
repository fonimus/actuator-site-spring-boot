import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import VueCodeMirror from 'vue-codemirror'
import VueClipboard from 'vue-clipboard2'
import {ClientTable, ServerTable} from 'vue-tables-2'
import axios from 'axios'
import nprogress from 'nprogress'
import VuexI18n from 'vuex-i18n'
import VueI18nDirectives from 'vue-i18n-directives';
import VueCookies from 'vue-cookies'
import moment from 'moment';

import ApiService from './modules/api'
import LoggerService from './modules/logger'
import I18nService from './modules/i18n'
import Raw from './pages/Raw.vue'
import Pagination from './pages/Pagination.vue'
import Spinner from './pages/Spinner.vue'
import Pie from './pages/Pie.vue'

import App from './pages/App.vue'
import router from './routes'

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(Notifications);
Vue.use(Vuex);
Vue.use(VueCodeMirror);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(VueCookies);

library.add(fas);
library.add(fab);

Vue.use(LoggerService);
Vue.use(I18nService);
Vue.use(ApiService);

Vue.component('fa', FontAwesomeIcon);
Vue.component('raw', Raw);
Vue.component('pagination', Pagination);
Vue.component('pie', Pie);
Vue.component('spinner', Spinner);

Vue.filter('date', function (value, formatParam) {
    let format = formatParam ? formatParam : 'MM/DD/YYYY HH:mm:ss';
    if (value) {
        return moment(String(value)).format(format)
    }
});

Vue.directive('confirm', {
    bind: function(el) {
        el.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
        });
    }
});

const tableOptions = {
    theme: 'bootstrap4',
    perPage: 25,
    perPageValues: [10, 25, 50, 100],
    sortIcon: {
        base: '', up: 'sort-up', down: 'sort-down', is: 'sort'
    }
};

Vue.use(ClientTable, tableOptions, false);
Vue.use(ServerTable, tableOptions, false);

const store = new Vuex.Store();
Vue.use(VuexI18n.plugin, store, {
    onTranslationNotFound(locale, key) {
        Vue.$log.warn(`i18n :: Key '${key}' not found for locale '${locale}'`)
    }
});
Vue.use(VueI18nDirectives);

let requestsCounter = 0;

nprogress.configure({showSpinner: false});

axios.interceptors.request.use(function (config) {
    requestsCounter++;
    nprogress.start();
    return config;
});

axios.interceptors.response.use(function (response) {
    if ((--requestsCounter) === 0) {
        nprogress.done();
    }
    return response;
}, function (error) {
    if ((--requestsCounter) === 0) {
        nprogress.done();
    }
    return Promise.reject(error);
});

Vue.http.interceptors.push((request, next) => {
    if (request.params === undefined) {
        request.params = {}
    }
    request.params.someToken = 'some-token-you-might-want';
    next();
});

new Vue({
    el: '#app',
    router,
    name: 'App',
    render: h => h(App),
    created() {
        this.$log.info('Running actuator website v' + version)
    }
});
