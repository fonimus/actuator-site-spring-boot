import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import fr from 'vuetify/src/locale/fr';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.min.css';
import VueClipboard from 'vue-clipboard2';
import axios from 'axios';
import nprogress from 'nprogress';
import VuexI18n from 'vuex-i18n';
import VueI18nDirectives from 'vue-i18n-directives';
import VueCookies from 'vue-cookies';
import moment from 'moment';
import VueHighlightJS from 'vue-highlight.js';
import 'highlight.js/styles/dracula.css';

// app, router
import App from './App.vue';
import router from './router';

// services
import ApiService from './services/api';
import LoggerService from './services/logger';
import I18nService from './services/i18n';

// components
import ActuatorCard from './components/ActuatorCard.vue';
import Raw from './components/Raw.vue';
import ButtonFilter from './components/ButtonFilter.vue';

Vue.use(Vuetify, {
    lang: {
        locales: {fr},
        current: 'en',
    },
});
Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.use(VueCookies);
Vue.use(VueHighlightJS);
Vue.use(ApiService);
Vue.use(LoggerService);
Vue.use(I18nService);

Vue.component('actuator-card', ActuatorCard);
Vue.component('raw', Raw);
Vue.component('button-filter', ButtonFilter);

Vue.filter('date', (value: Date, formatParam: string) => {
    const format = formatParam || 'MM/DD/YYYY HH:mm:ss';
    if (value) {
        return moment(String(value)).format(format);
    }
});

declare module 'vue/types/vue' {
    interface VueConstructor {
        $languages: any;
    }
}

declare module 'vue/types/vue' {
    interface VueConstructor {
        $log: any;
    }
}

declare module 'vue/types/vue' {
    interface VueConstructor {
        $api: any;
    }
}

declare module 'vue/types/vue' {
    interface VueConstructor {
        $snack: any;
    }
}

const store = new Vuex.Store({});
Vue.use(VuexI18n.plugin, store, {
    onTranslationNotFound(locale: string, key: string) {
        Vue.$log.warn(`i18n :: Key '${key}' not found for locale '${locale}'`);
    },
});
Vue.use(VueI18nDirectives);

let requestsCounter = 0;

nprogress.configure({showSpinner: false});

axios.interceptors.request.use((config) => {
    requestsCounter++;
    nprogress.start();
    return config;
});

axios.interceptors.response.use((response) => {
    if ((--requestsCounter) === 0) {
        nprogress.done();
    }
    return response;
}, (error) => {
    if ((--requestsCounter) === 0) {
        nprogress.done();
    }
    return Promise.reject(error);
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
