const utils = {
    putIfAbsent: (list, element) => {
        if (list.indexOf(element) === -1) {
            list.push(element)
        }
    },
    color: (value) => {
        if (!isNaN(value)) {
            if (value >= 200 && value < 300) {
                return '#4caf50'
            } else if (value >= 400 && value < 500) {
                return '#ffc107'
            } else if (value >= 500 && value < 600) {
                return '#ff5252'
            }
        }
        let color = null;
        switch (value) {
            case 'UP':
            case 'GET':
            case 'CRON':
            case 'INFO':
            case 'systemProperties':
            case 'RUNNABLE':
            case 'POSITIVE':
            case 'AUTHORIZATION_SUCCESS':
            case 'AUTHENTICATION_SUCCESS':
            case 'singleton':
            case '2XX':
                color = '#4caf50';
                break;
            case 'OUT_OF_SERVICE':
            case 'POST':
            case 'PUT':
            case 'PATCH':
            case 'FIXEDDELAY':
            case 'WARN':
            case 'server.ports':
            case 'WAITING':
            case 'TIMED_WAITING':
            case 'request':
            case '4XX':
                color = '#ffc107';
                break;
            case 'DOWN':
            case 'DELETE':
            case 'NEGATIVE':
            case 'ERROR':
            case 'commandLineArgs':
            case 'BLOCKED':
            case 'AUTHORIZATION_FAILURE':
            case 'AUTHENTICATION_FAILURE':
            case 'FIXEDRATE':
            case '5XX':
                color = '#ff5252';
                break;
            case 'prototype':
            case 'HEAD':
            case 'servletContextInitParams':
            case 'defaultProperties':
            case 'UNCONDITIONAL':
            case 'NEW':
            case 'TERMINATED':
            case '3XX':
            case 'AUTHENTICATION_SWITCH':
                color = 'primary';
                break;
            case 'OFF':
            case 'UNKNOWN':
            case 'OPTIONS':
            case 'session':
            case 'global-session':
                color = 'dark';
                break;
            case 'TRACE':
            case 'systemEnvironment':
                color = '#00bcd4';
                break;
            case 'DEBUG':
            case 'CONNECT':
                color = '#9c27b0';
                break;
            default:
                color = null;
                break;
        }
        return color
    }
};

export default utils
