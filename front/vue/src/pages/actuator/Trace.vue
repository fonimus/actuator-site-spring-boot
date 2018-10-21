<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'trace.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../httptrace">
                    <fa class="space" icon="share-square" v-b-tooltip.hover :title="$t('go.to')"/>
                </a>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <div class="alert alert-primary">
                    <div class="form-group">
                        <label for="search" v-t="'filter.uri'"></label>
                        <input id="search" type="text" class="form-control" :placeholder="$t('common.filter')"
                               v-on:input="filterUri($event.target.value)"/>
                    </div>
                    <p>
                        <span v-t="'filter.methods'"></span>
                        <span class="space badge pointer" @click="filter('all')"
                              v-bind:class="badge('all', methodFilter === 'all')"><span v-t="'common.all'"></span>
                        </span>
                        <span class="space badge pointer" @click="filter(method)"
                              v-bind:class="badge(method, methodFilter === method)" v-for="method in methods"
                              :key="method">{{method}}</span>
                    </p>
                </div>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="timestamp" slot-scope="props">
                        <span>{{props.row.timestamp | date}}</span>
                    </div>
                    <div slot="method" slot-scope="props">
                        <span class="badge"
                              v-bind:class="badge(props.row.request.method)">{{props.row.request.method}}</span>
                    </div>
                    <div slot="uri" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.request.uri)">{{props.row.request.uri}}</span>
                    </div>
                    <div slot="status" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.response.status)">{{props.row.response.status}}</span>
                    </div>
                    <div slot="details" slot-scope="props">
                        <raw :raw="props.row"></raw>
                    </div>
                </v-client-table>
                <pagination :table="table" v-if="table"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Abstract from './Abstract.vue'
    import {Event} from 'vue-tables-2'

    export default {
        name: 'Trace',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.trace'),
                columns: ['timestamp', 'uri', 'timeTaken', 'status', 'method', 'details'],
                methodFilter: null
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            options() {
                return this.buildTableOptions({
                    sortable: ['timestamp', 'timeTaken', 'status', 'method', 'uri'],
                    filterByColumn: false,
                    columnsClasses: {
                        details: 'column-size-limited-60 text-center',
                        timeTaken: 'column-size-limited-80',
                        status: 'column-size-limited-80 text-center',
                        method: 'column-size-limited-80 text-center',
                    },
                    headings: {
                        timestamp: this.$t('common.timestamp'),
                        timeTaken: this.$t('trace.time-taken'),
                        status: this.$t('common.status'),
                        method: this.$t('common.method'),
                        uri: this.$t('trace.uri'),
                        details: this.$t('common.details')
                    },
                    customFilters: [{
                        name: 'byMethod',
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.request.method === query;
                        }
                    }, {
                        name: 'byUri',
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.request.uri.indexOf(query) !== -1;
                        }
                    }, {
                        name: 'byStatus',
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.request.uri.indexOf(query) !== -1;
                        }
                    }]
                });
            },
            filter(method) {
                this.methodFilter = method;
                Event.$emit('vue-tables.filter::byMethod', method);
            },
            filterUri(uri) {
                Event.$emit('vue-tables.filter::byUri', uri);
            },
            filterStatus(status) {
                Event.$emit('vue-tables.filter::byStatus', status);
            },
            internalRefresh() {
                return this.$api.httptrace().then(response => {
                    this.source = response.data;
                    this.tableData = response.data.traces;
                });
            }
        }
    }
</script>
