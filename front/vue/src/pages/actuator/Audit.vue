<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'audit.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../auditevents">
                    <fa class="space" icon="share-square" v-b-tooltip.hover :title="$t('go.to')"/>
                </a>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <p class="alert alert-primary">
                    <span v-t="'filter.types'"></span>
                    <span class="space badge pointer" @click="filter('all')"
                          v-bind:class="badge('all', typeFilter === 'all')">
                        <span v-t="'common.all'"></span>
                    </span>
                    <span class="space badge pointer" @click="filter(type)"
                          v-bind:class="badge(type, typeFilter === type)" v-for="type in types"
                          :key="type">{{type}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="timestamp" slot-scope="props">
                        <span>{{props.row.timestamp | date}}</span>
                    </div>
                    <div slot="type" slot-scope="props">
                        <span class="badge"
                              v-bind:class="badge(props.row.type)">{{props.row.type}}</span>
                    </div>
                    <div slot="message" slot-scope="props">
                        <span v-if="props.row.data">{{props.row.data.message}}</span>
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
        name: 'Audit',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.audit'),
                types: [],
                typeFilter: null,
                columns: ['timestamp', 'principal', 'type', 'message', 'details']
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            filter(type) {
                this.typeFilter = type;
                Event.$emit('vue-tables.filter::byType', type);
            },
            options() {
                return this.buildTableOptions({
                    sortable: ['timestamp', 'principal', 'type'],
                    filterByColumn: true,
                    filterable: ['principal'],
                    columnsClasses: {
                        details: 'column-size-limited-60 text-center'
                    },
                    headings: {
                        timestamp: this.$t('common.timestamp'),
                        principal: this.$t('common.principal'),
                        type: this.$t('common.type'),
                        message: this.$t('common.message'),
                        details: this.$t('common.details')
                    },
                    customFilters: [{
                        name: 'byType',
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.type === query;
                        }
                    }]
                });
            },
            internalRefresh() {
                return this.$api.auditevents().then(response => {
                    this.source = response.data;
                    this.tableData = response.data.events;
                    this.types = [];
                    for (let event of response.data.events) {
                        this.putIfAbsent(this.types, event.type);
                    }
                });
            }
        }
    }
</script>
