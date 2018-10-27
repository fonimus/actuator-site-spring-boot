import axios from 'axios'

const I18nService = {}

I18nService.install = function (Vue) {
  Vue.prototype.$languages = {
    changeLanguage (language) {
      if (Vue.i18n.locale() !== language) {
        if (!Vue.i18n.localeExists(language)) {
          return axios.get(`i18n/${language}.json`).then((response) => {
            Vue.i18n.add(language, response.data)
            Vue.i18n.set(language)
          }).catch((e) => {
            Vue.$log.error('Error while getting translation: ' + language, e)
            throw e
          })
        } else {
          Vue.i18n.set(language)
        }
      }
      return Promise.resolve()
    }
  }
}

export default I18nService
