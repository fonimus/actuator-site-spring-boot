import axios from 'axios'

let baseUrl = '..';
let actuatorPath = '';
if (process.env.REACT_APP_DEMO === 'demo') {
    baseUrl = 'actuator/';
    actuatorPath = 'actuator'
} else if (process.env.NODE_ENV === 'development') {
    baseUrl = '/actuator'
}

const api = {
    actuator: () => {
        return axios.get(`${baseUrl}${actuatorPath}`)
    },
    info: () => {
        return axios.get(`${baseUrl}/info`)
    },
    health: () => {
        return axios.get(`${baseUrl}/health`)
    },
    metrics: () => {
        return axios.get(`${baseUrl}/metrics`)
    },
    env: () => {
        return axios.get(`${baseUrl}/env`)
    },
    mappings: () => {
        return axios.get(`${baseUrl}/mappings`)
    },
    beans: () => {
        return axios.get(`${baseUrl}/beans`)
    },
    configprops: () => {
        return axios.get(`${baseUrl}/configprops`)
    },
    loggers: () => {
        return axios.get(`${baseUrl}/loggers`)
    },
    loggerUpdate: (name, level) => {
        return axios.post(`${baseUrl}/loggers/${name}`, {
            'configuredLevel': level
        })
    },
    threaddump: () => {
        return axios.get(`${baseUrl}/threaddump`)
    },
    conditions: () => {
        return axios.get(`${baseUrl}/conditions`)
    },
    httptrace: () => {
        return axios.get(`${baseUrl}/httptrace`)
    },
    scheduledtasks: () => {
        return axios.get(`${baseUrl}/scheduledtasks`)
    },
    auditevents: () => {
        return axios.get(`${baseUrl}/auditevents`)
    }
};

export default api
