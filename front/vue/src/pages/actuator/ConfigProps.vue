<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'configprops.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../configprops">
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
                        <v-client-table :ref="tableData.name" :data="tableData.data" :columns="columns"
                                        :options="options()">
                            <div slot="prefix" slot-scope="props">
                                <span class="badge badge-success">{{props.row.prefix}}</span>
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

    export default {
        name: 'ConfigProps',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.configprops'),
                columns: ['name', 'prefix', 'details']
            }
        },
        updated() {
            this.multipleTable();
        },
        methods: {
            options() {
                return this.buildTableOptions({
                    sortable: ['name', 'prefix', 'details'],
                    filterByColumn: true,
                    filterable: ['name', 'prefix'],
                    columnsClasses: {
                        name: 'column-size-limited-500',
                        details: 'column-size-limited-60 text-center',
                    },
                    headings: {
                        name: this.$t('configprops.name'),
                        prefix: this.$t('configprops.prefix'),
                        details: this.$t('common.details')
                    }
                });
            },
            internalRefresh() {
                return this.$api.configprops().then(response => {
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
