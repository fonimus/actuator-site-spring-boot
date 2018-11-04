<template>
    <actuator-card :source="source" :refresh="refresh" url="/configprops">
        <template slot="title">
            <span v-t="'configprops.title'"></span>
        </template>
        <template slot="content">
            <v-tabs v-model="tabActive" slider-color="primary">
                <v-tab v-for="tableData of tableDataList" :key="tableData.name" ripple>
                    <span v-t="'common.context'"></span> : <span>{{ tableData.name }}</span>
                </v-tab>
                <v-tab-item v-for="tableData of tableDataList" :key="tableData.name">
                    <v-card flat>
                        <v-layout justify-space-between class="filters">
                            <v-text-field v-model="search" append-icon="search" :label="$t('common.filter')"
                                          single-line
                                          hide-details>

                            </v-text-field>
                        </v-layout>

                        <v-data-table class="table-shadow" :headers="headers" :items="rows" :search="search"
                                      :loading="loading"
                                      :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                            <template slot="items" slot-scope="props">
                                <td class="column-max-name">{{ props.item.name }}</td>
                                <td>
                                    <v-btn small round color="success" class="v-btn--no-transform">
                                        {{ props.item.prefix }}
                                    </v-btn>
                                </td>
                                <td>
                                    <raw :raw="props.item"></raw>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    export default {
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.conditions'),
                pagination: {rowsPerPage: 10}
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.configprops().then((response) => {
                    this.source = response.data;
                    for (const contextName in response.data.contexts) {
                        if (response.data.contexts.hasOwnProperty(contextName)) {
                            this.tableDataList[contextName] = {
                                name: contextName,
                                parent: response.data.contexts[contextName].parentId,
                                data: []
                            };
                            for (const beanName in response.data.contexts[contextName].beans) {
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
        },
        computed: {
            rows() {
                if (!this.tab) {
                    return [];
                }
                return this.tableDataList[this.tab].data;
            },
            headers() {
                return [
                    {text: this.$t('configprops.name'), value: 'name'},
                    {text: this.$t('configprops.prefix'), value: 'prefix'},
                    {text: this.$t('common.details'), value: 'none'}
                ];
            }
        }
    };
</script>
