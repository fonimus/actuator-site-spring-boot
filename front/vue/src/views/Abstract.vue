<script>
    export default {
        data() {
            return {
                source: null,
                loading: false,
                dialogLoading: false,
                search: '',
                tab: null,
                tabActive: null,
                error: null,
                tabIndex: 0,
                tableDataList: {},
                tables: {},
                tableData: [],
                table: null,
                itemsPerPage: [5, 10, 25, 50],
                methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT']
            };
        },
        created() {
            this.refresh();
        },
        methods: {
            refresh() {
                this.source = null;
                this.loading = true;
                this.internalRefresh().then(() => {
                    const keys = Object.keys(this.tableDataList);
                    if (keys.length > 0) {
                        this.tab = keys[0];
                    }
                }).catch((e) => {
                    this.$log.error(this.errorMessage + ': ', e);
                    this.$snack.error(this.errorMessage);
                    this.error = e;
                }).finally(() => {
                    this.loading = false;
                    this.dialogLoading = false;
                });
            },
            activate(filterList, type) {
                this.putIfAbsent(filterList, type);
            },
            deactivate(filterList, type) {
                const idx = filterList.indexOf(type);
                if (idx > -1) {
                    filterList.splice(idx, 1);
                }
            },
            color(value) {
                if (!isNaN(value)) {
                    if (value >= 200 && value < 300) {
                        return 'success';
                    } else if (value >= 400 && value < 500) {
                        return 'warning';
                    } else if (value >= 500 && value < 600) {
                        return 'error';
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
                        color = 'success';
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
                        color = 'warning';
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
                        color = 'error';
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
                    case 'UNCONDITIONAL':
                    case 'UNKNOWN':
                    case 'OPTIONS':
                    case 'session':
                    case 'global-session':
                        color = 'dark';
                        break;
                    case 'TRACE':
                    case 'systemEnvironment':
                        color = 'cyan';
                        break;
                    case 'DEBUG':
                    case 'CONNECT':
                        color = 'purple';
                        break;
                }
                return color;
            },
            putIfAbsent(list, element) {
                if (list.indexOf(element) === -1) {
                    list.push(element);
                }
            }
        }
    };
</script>

<style scoped>
    .search-field {
        margin-left: 20px;
        padding-top: 0;
    }

    .v-tabs {
        margin-top: 5px;
    }

    .column-max-name {
        max-width: 350px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
