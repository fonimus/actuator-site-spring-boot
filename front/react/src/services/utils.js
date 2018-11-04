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
        let color;
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
            case 'success':
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
            case 'NEW':
            case 'TERMINATED':
            case '3XX':
            case 'AUTHENTICATION_SWITCH':
                color = 'primary';
                break;
            case 'OFF':
            case 'UNKNOWN':
            case 'UNCONDITIONAL':
            case 'OPTIONS':
            case 'session':
            case 'global-session':
                color = '#000000';
                break;
            case 'TRACE':
            case 'systemEnvironment':
                color = '#00bcd4';
                break;
            case 'DEBUG':
            case 'CONNECT':
                color = '#9c27b0';
                break;
            case 'info':
                color = '#2196f3';
                break;
            default:
                color = '#000000';
                break;
        }
        return color
    },
    stableSort: (array, cmp) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    },

    getSorting: (order, orderBy) => {
        return order === 'desc' ? (a, b) => utils.desc(a, b, orderBy) : (a, b) => -utils.desc(a, b, orderBy);
    },

    desc: (a, b, orderBy) => {
        if (utils.byString(b, orderBy) < utils.byString(a, orderBy)) {
            return -1;
        }
        if (utils.byString(b, orderBy) > utils.byString(a, orderBy)) {
            return 1;
        }
        return 0;
    },

    byString: (object, property) => {
        property = property.replace(/\[(\w+)]/g, '.$1');
        property = property.replace(/^\./, '');
        const a = property.split('.');
        let i = 0, n = a.length;
        for (; i < n; ++i) {
            const k = a[i];
            if (k in object) {
                object = object[k];
            } else {
                return;
            }
        }
        if (typeof object === 'string') {
            return object.toLowerCase();
        }
        return object;
    },

    perPage: (data, defaultValue) => {
        if (data.length < defaultValue) {
            return data.length;
        }
        return defaultValue;
    },

    buildFilter: (list, value, onSelect) => {
        let newList = [].concat(list);
        if (onSelect) {
            utils.putIfAbsent(newList, value)
        } else {
            const idx = newList.indexOf(value);
            if (idx > -1) {
                newList.splice(idx, 1);
            }
        }
        return newList;
    },

    inFilter: (list, value) => {
        return !list || list.length === 0 || !value || list.indexOf(value) !== -1;
    },

    search: (search, value, properties) => {
        if (!search || search === '' || !value || !properties || properties.length === 0) {
            return true;
        }
        let toSearch = search.toLowerCase();
        for (let property of properties) {
            let propertyValue = utils.byString(value, property);
            if (propertyValue && propertyValue.toString().toLowerCase().indexOf(toSearch) !== -1) {
                return true;
            }
        }
        return false;
    },

    statuses: ['2XX', '3XX', '4XX', '5XX'],
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT'],
    defaultCardContentStyle: {
        customCardContent: {
            padding: '16px'
        }
    }
};

export default utils
