<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'dump.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <p class="alert alert-primary">
                    <span v-t="'filter.state'"></span>
                    <span class="space badge pointer" @click="filter('all')"
                          v-bind:class="badge('all', stateFilter === 'all')"><span v-t="'common.all'"></span></span>
                    <span class="space badge pointer" @click="filter(state)"
                          v-bind:class="badge(state, stateFilter === state)" v-for="state in states"
                          :key="state">{{state}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="threadState" slot-scope="props">
                        <span class="badge"
                              v-bind:class="badge(props.row.threadState)">{{props.row.threadState}}</span>
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
        name: 'Dump',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.dump'),
                states: [],
                stateFilter: null,
                columns: ['threadId', 'threadName', 'threadState', 'details']
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            filter(state) {
                this.stateFilter = state;
                Event.$emit('vue-tables.filter::byState', state);
            },
            options() {
                return this.buildTableOptions({
                    sortable: ['threadId', 'threadName', 'threadState'],
                    filterByColumn: true,
                    filterable: ['threadName'],
                    columnsClasses: {
                        details: 'column-size-limited-60 text-center'
                    },
                    headings: {
                        threadId: this.$t('dump.thread-id'),
                        threadName: this.$t('dump.thread-name'),
                        threadState: this.$t('dump.thread-state'),
                        message: this.$t('common.message'),
                        details: this.$t('common.details')
                    },
                    customFilters: [{
                        name: 'byState',
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.threadState === query;
                        }
                    }]
                });
            },
            internalRefresh() {
                return this.$api.threaddump().then(response => {
                    this.source = response.data;
                    this.tableData = response.data.threads;
                    this.states = [];
                    for (let thread of response.data.threads) {
                        this.putIfAbsent(this.states, thread.threadState);
                    }
                });
            }
        }
    }
</script>
