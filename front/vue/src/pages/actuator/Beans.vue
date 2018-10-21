<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'beans.title'"></span></div>
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
                            <span v-t="'filter.scopes'"></span>
                            <span class="space badge pointer" @click="filter('all', tableData.name)"
                                  v-bind:class="badge('all', scopeFilter === 'all')"><span v-t="'common.all'"></span>
                            </span>
                            <span class="space badge pointer" @click="filter(scope, tableData.name)"
                                  v-bind:class="badge(scope, scopeFilter === scope)" v-for="scope in scopes"
                                  :key="scope">{{scope}}</span>
                        </p>
                        <v-client-table :ref="tableData.name" :data="tableData.data" :columns="columns"
                                        :options="options(tableData.name)">
                            <div slot="name" slot-scope="props">
                                <span v-b-tooltip.hover :title="props.row.name">{{props.row.name}}</span>
                            </div>
                            <div slot="type" slot-scope="props">
                                <span v-b-tooltip.hover :title="props.row.type">{{props.row.type}}</span>
                            </div>
                            <div slot="scope" slot-scope="props">
                                <span class="badge" v-bind:class="badge(props.row.scope)">{{props.row.scope}}</span>
                            </div>
                            <div slot="dependencies" slot-scope="props" class="white-space-normal">
                                <span class="badge space" v-bind:class="badge(scope, 'beans')"
                                      v-for="dependency in props.row.dependencies">{{dependency}}</span>
                            </div>
                            <div slot="details" slot-scope="props">
                                <raw :raw="props.row"></raw>
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

    export default {
        name: 'Beans',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.beans'),
                scopes: [],
                scopeFilter: null,
                columns: ['name', 'scope', 'type', 'dependencies', 'details']
            }
        },
        updated() {
            this.multipleTable();
        },
        methods: {
            filter(scope, table) {
                this.scopeFilter = scope;
                Event.$emit('vue-tables.filter::' + this.filterName('byScope', table), scope);
            },
            options(table) {
                return this.buildTableOptions({
                    sortable: ['name', 'scope', 'type'],
                    filterByColumn: true,
                    filterable: ['name', 'type'],
                    columnsClasses: {
                        name: 'column-size-limited-300',
                        type: 'column-size-limited-300',
                        dependencies: 'column-size-limited-300',
                        scope: 'column-size-limited-80 text-center',
                        details: 'column-size-limited-60 text-center',
                    },
                    headings: {
                        name: this.$t('beans.name'),
                        scope: this.$t('beans.scope'),
                        type: this.$t('common.type'),
                        dependencies: this.$t('beans.dependencies'),
                        details: this.$t('common.details')
                    },
                    customFilters: [{
                        name: this.filterName('byScope', table),
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            return row.scope === query;
                        }
                    }]
                });
            },
            internalRefresh() {
                return this.$api.beans().then(response => {
                    this.source = response.data;
                    for (let contextName in response.data.contexts) {
                        if (response.data.contexts.hasOwnProperty(contextName)) {
                            this.tableDataList[contextName] = {
                                name: contextName,
                                parent: response.data.contexts[contextName].parentId,
                                data: []
                            };
                            for (let beanName in response.data.contexts[contextName].beans) {
                                if (response.data.contexts[contextName].beans.hasOwnProperty(beanName)) {
                                    const bean = {
                                        name: beanName
                                    };
                                    Object.assign(bean, response.data.contexts[contextName].beans[beanName]);
                                    this.putIfAbsent(this.scopes, bean.scope);
                                    this.tableDataList[contextName].data.push(bean);
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>
