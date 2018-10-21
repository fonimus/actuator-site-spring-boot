<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'mappings.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../mappings">
                    <fa class="space" icon="share-square" v-b-tooltip.hover :title="$t('go.to')"/>
                </a>
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
                            <span v-t="'filter.methods'"></span>
                            <span class="space badge pointer" @click="filter('all', tableData.name)"
                                  v-bind:class="badge('all', methodFilter === 'all')"><span v-t="'common.all'"></span></span>
                            <span class="space badge pointer" @click="filter(method, tableData.name)"
                                  v-bind:class="badge(method, methodFilter === method)" v-for="method in methods"
                                  :key="method">{{method}}</span>
                        </p>
                        <v-client-table :ref="tableData.name" :data="tableData.data" :columns="columns"
                                        :options="options(tableData.name)">
                            <div slot="patterns" slot-scope="props">
                                <span v-if="typeof props.row.patterns !== 'string'" class="badge badge-info space"
                                      v-for="pattern in props.row.patterns">{{pattern}}</span>
                                <span v-if="typeof props.row.patterns === 'string'" class="badge badge-info space">{{props.row.patterns}}</span>
                            </div>
                            <div slot="methods" slot-scope="props">
                                <span class="badge space" v-bind:class="badge(method)"
                                      v-for="method in props.row.methods">{{method}}</span>
                            </div>
                            <div slot="class" slot-scope="props">
                                <span v-b-tooltip.hover :title="props.row.class">{{props.row.class}}</span>
                            </div>
                            <div slot="details" slot-scope="props">
                                <raw :raw="props.row.original"></raw>
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
        name: 'Mappings',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.mappings'),
                columns: ['patterns', 'methods', 'class', 'method', 'details'],
                methodFilter: null
            }
        },
        updated() {
            this.multipleTable();
        },
        methods: {
            filter(method, table) {
                this.methodFilter = method;
                Event.$emit('vue-tables.filter::' + this.filterName('byMethod', table), method);
            },
            options(table) {
                return this.buildTableOptions({
                    filterByColumn: true,
                    filterable: ['patterns', 'class', 'method'],
                    headings: {
                        patterns: this.$t('mappings.patterns'),
                        methods: this.$t('mappings.http-methods'),
                        class: this.$t('mappings.java-class'),
                        method: this.$t('mappings.java-method'),
                        details: this.$t('common.details')
                    },
                    columnsClasses: {
                        class: 'column-size-limited-500',
                        method: 'column-size-limited-80 text-center',
                        methods: 'column-size-limited-80 text-center',
                        details: 'column-size-limited-60 text-center',
                    },
                    customFilters: [{
                        name: this.filterName('byMethod', table),
                        callback: function (row, query) {
                            if (!query || query === 'all') {
                                return true;
                            }
                            if (!row.methods) {
                                return false;
                            }
                            return row.methods.indexOf(query) !== -1;
                        }
                    }]
                });
            },
            internalRefresh() {
                return this.$api.mappings().then(response => {
                    this.source = response.data;
                    for (let contextName in response.data.contexts) {
                        if (response.data.contexts.hasOwnProperty(contextName)) {
                            this.tableDataList[contextName] = {
                                name: contextName,
                                parent: response.data.contexts[contextName].parentId,
                                data: []
                            };
                            for (let dispatcherServletName in response.data.contexts[contextName].mappings.dispatcherServlets) {
                                if (response.data.contexts[contextName].mappings.dispatcherServlets.hasOwnProperty(dispatcherServletName)) {
                                    for (let mappingName in response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName]) {
                                        if (response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName].hasOwnProperty(mappingName)) {
                                            let originalMapping = response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName][mappingName];
                                            const mapping = {
                                                id: mappingName,
                                                original: originalMapping
                                            };
                                            if (originalMapping.details) {
                                                mapping.class = originalMapping.details.handlerMethod.className;
                                                mapping.method = originalMapping.details.handlerMethod.name;
                                                mapping.methods = originalMapping.details.requestMappingConditions.methods;
                                                mapping.patterns = originalMapping.details.requestMappingConditions.patterns;
                                            } else {
                                                mapping.patterns = originalMapping.predicate;
                                            }
                                            this.tableDataList[contextName].data.push(mapping);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>
