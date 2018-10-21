<script>
    export default {
        data() {
            return {
                source: null,
                loading: false,
                error: null,
                errorMessage: null,
                paginationReady: false,
                tabIndex: 0,
                maxPages: 10,
                tableDataList: {},
                tables: {},
                tableData: [],
                table: null,
                methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT']
            }
        },
        created() {
            this.refresh()
        },
        methods: {
            refresh() {
                this.source = null;
                this.loading = true;
                this.internalRefresh().catch(e => {
                    this.$log.error(this.errorMessage + ': ', e);
                    this.$notify({group: 'general', type: 'error', title: this.errorMessage});
                    this.error = e
                }).finally(() => {
                    this.loading = false
                })
            },
            badge(value, enabled) {
                let prefix = 'badge-';
                if (enabled != null && !enabled) {
                    return prefix + 'secondary';
                }
                if (!isNaN(value)) {
                    if (value >= 200 && value < 300) {
                        return prefix + 'success';
                    } else if (value >= 400 && value < 500) {
                        return prefix + 'warning';
                    } else if (value >= 500 && value < 600) {
                        return prefix + 'danger';
                    }
                }
                let badge = 'info';
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
                        badge = 'success';
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
                        badge = 'warning';
                        break;
                    case 'DOWN':
                    case 'DELETE':
                    case 'NEGATIVE':
                    case 'ERROR':
                    case 'commandLineArgs':
                    case 'BLOCKED':
                    case 'AUTHORIZATION_FAILURE':
                    case 'AUTHENTICATION_FAILURE':
                    case '503':
                        badge = 'danger';
                        break;
                    case 'prototype':
                    case 'HEAD':
                    case 'FIXEDRATE':
                    case 'servletContextInitParams':
                    case 'defaultProperties':
                    case 'UNCONDITIONAL':
                    case 'NEW':
                    case 'TERMINATED':
                    case 'AUTHENTICATION_SWITCH':
                        badge = 'primary';
                        break;
                    case 'OFF':
                    case 'UNKNOWN':
                    case 'OPTIONS':
                    case 'CONNECT':
                    case 'session':
                    case 'global-session':
                        badge = 'dark';
                        break;
                    case 'TRACE':
                        badge = 'light';
                        break;
                }
                return prefix + badge;
            },
            tab(name) {
                let keys = Object.keys(this.tableDataList);
                for (let key in keys) {
                    if (keys[key] === name) {
                        this.tabIndex = key;
                        break;
                    }
                }
            },
            putIfAbsent(list, element) {
                if (list.indexOf(element) === -1) {
                    list.push(element,)
                }
            },
            singleTable() {
                this.table = this.$refs.table;
            },
            filterName(filterName, tableName) {
                return filterName + '--' + tableName;
            },
            multipleTable() {
                setTimeout(function () {
                    for (let key in this.tableDataList) {
                        if (this.tableDataList.hasOwnProperty(key)) {
                            if (this.$refs[key]) {
                                this.tables[key] = this.$refs[key][0];
                            }
                        }
                    }
                    this.paginationReady = true;
                }.bind(this), 100);
            },
            buildTableOptions(options) {
                return Object.assign({
                    texts: {
                        noResults: this.$t('table.no-results'),
                        filterBy: this.$t('table.filter-by')
                    }
                }, options);
            }
        }
    }
</script>
