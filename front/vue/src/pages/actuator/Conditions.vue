<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'conditions.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <b-tabs pills v-model="tabIndex">
                    <b-tab :title="tableData.name" :key="tableData.name" v-for="tableData of tableDataList">
                        <p v-if="tableData.parent" class="alert alert-info">
                            <span v-t="'common.parent-context'"></span>
                            <span class="tab-link" @click="tab(tableData.parent)">{{tableData.parent}}</span>
                        </p>
                        <p class="alert alert-primary">
                            <span v-t="'filter.types'"></span>
                            <span class="space badge pointer" @click="filter(tableData.name, 'all')"
                                  v-bind:class="badge('all')"><span v-t="'common.all'"></span></span>
                            <span class="space badge pointer" @click="filter(tableData.name, 'POSITIVE')"
                                  v-bind:class="badge('POSITIVE')">POSITIVE</span>
                            <span class="space badge pointer" @click="filter(tableData.name, 'NEGATIVE')"
                                  v-bind:class="badge('NEGATIVE')">NEGATIVE</span>
                            <span class="space badge pointer" @click="filter(tableData.name, 'UNCONDITIONAL')"
                                  v-bind:class="badge('UNCONDITIONAL')">UNCONDITIONAL</span>
                        </p>
                        <v-client-table :ref="tableData.name" :data="tableData.data" :columns="columns"
                                        :options="options(tableData.name)">
                            <div slot="type" slot-scope="props">
                                <span class="badge" v-bind:class="badge(props.row.type)">{{props.row.type}}</span>
                            </div>
                            <div slot="details" slot-scope="props">
                                <raw :raw="props.row.original" v-if="props.row.original"></raw>
                            </div>
                        </v-client-table>
                        <pagination :table="tables[tableData.name]" v-if="paginationReady"></pagination>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import Abstract from './Abstract.vue'
    import {Event} from 'vue-tables-2'

    function map(matches, type) {
        return Object.keys(matches).map(function (key) {
            return {
                name: key,
                type: type,
                original: matches[key]
            };
        });
    }

    export default {
        name: 'Conditions',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.conditions'),
                columns: ['name', 'type', 'details']
            }
        },
        updated() {
            this.multipleTable();
        },
        methods: {
            filter(table, source) {
                Event.$emit('vue-tables.filter::' + this.filterName('byType', table), source);
            },
            options(table) {
                return this.buildTableOptions({
                    sortable: ['name', 'type', 'details'],
                    filterByColumn: true,
                    filterable: ['name'],
                    columnsClasses: {
                        name: 'column-size-limited-500',
                        type: 'column-size-limited-80 text-center',
                        details: 'column-size-limited-60 text-center',
                    },
                    headings: {
                        name: this.$t('common.name'),
                        type: this.$t('common.type'),
                        details: this.$t('common.details')
                    },
                    customFilters: [{
                        name: this.filterName('byType', table),
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
                return this.$api.conditions().then(response => {
                    this.source = response.data;
                    for (let contextName in response.data.contexts) {
                        if (response.data.contexts.hasOwnProperty(contextName)) {
                            this.tableDataList[contextName] = {
                                name: contextName,
                                parent: response.data.contexts[contextName].parentId,
                                data: []
                            };
                            this.tableDataList[contextName].data = this.tableDataList[contextName].data.concat(map(response.data.contexts[contextName].positiveMatches, 'POSITIVE'));
                            this.tableDataList[contextName].data = this.tableDataList[contextName].data.concat(map(response.data.contexts[contextName].negativeMatches, 'NEGATIVE'));
                            for (let idx in response.data.contexts[contextName].unconditionalClasses) {
                                if (response.data.contexts[contextName].unconditionalClasses.hasOwnProperty(idx)) {
                                    this.tableDataList[contextName].data.push({
                                        name: response.data.contexts[contextName].unconditionalClasses[idx],
                                        type: 'UNCONDITIONAL'
                                    });
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>
