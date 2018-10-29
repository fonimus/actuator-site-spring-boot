import axios from 'axios'

const i18n = {
    load: (locale) => {
        return axios.get(`i18n/${locale}.json`)
    }
};

export default i18n
