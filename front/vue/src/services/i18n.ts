import axios from 'axios';

export default {
    install: (Vue: any) => {
        Vue.prototype.$languages = {
            changeLanguage(language: string) {
                if (Vue.i18n.locale() !== language) {
                    if (!Vue.i18n.localeExists(language)) {
                        return axios.get(`i18n/${language}.json`).then((response) => {
                            Vue.i18n.add(language, response.data);
                            Vue.i18n.set(language);
                        }).catch((e) => {
                            Vue.$log.error('Error while getting translation: ' + language, e);
                            throw e;
                        });
                    } else {
                        Vue.i18n.set(language);
                    }
                }
                return Promise.resolve();
            },
        };
    },
};
