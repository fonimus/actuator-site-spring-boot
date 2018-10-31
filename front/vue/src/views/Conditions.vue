<template>
    <actuator-card :source="source" :refresh="refresh" url="/conditions">
        <template slot="title">
            <span v-t="'conditions.title'"></span>
        </template>
        <template slot="content">
            <v-tabs v-model="tabActive">
                <v-tab v-for="tableData of tableDataList" :key="tableData.name" ripple>
                    <span v-t="'common.context'"></span> : <span>{{ tableData.name }}</span>
                </v-tab>
                <v-tab-item v-for="tableData of tableDataList" :key="tableData.name">
                    <v-card flat>
                        <v-card-text>

                            <v-layout justify-space-between class="filters">
                                <div>
                                    <span v-t="'filter.types'"></span>
                                    <button-filter v-for="scope in types" :key="scope" :name="scope"
                                                   :on-select="activate.bind(this, typeFilters, scope)"
                                                   :on-remove="deactivate.bind(this, typeFilters, scope)"
                                                   :color="color(scope)">

                                    </button-filter>
                                </div>

                                <v-text-field class="search-field" v-model="search" append-icon="search"
                                              :label="$t('common.filter')"
                                              single-line
                                              hide-details>

                                </v-text-field>
                            </v-layout>

                            <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                                          :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                                <template slot="items" slot-scope="props">
                                    <td class="column-max-name">{{ props.item.name }}</td>
                                    <td>
                                        <v-btn small round :color="color(props.item.type)">{{ props.item.type }}</v-btn>
                                    </td>
                                    <td>
                                        <raw :raw="props.item"></raw>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    function map(matches, type) {
        return Object.keys(matches).map((key) => ({
            name: key,
            type,
            original: matches[key]
        }));
    }

    export default {
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.conditions'),
                types: ['POSITIVE', 'NEGATIVE', 'UNCONDITIONAL'],
                typeFilters: [],
                pagination: {rowsPerPage: 10}
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.conditions().then((response) => {
                    this.source = response.data;
                    for (const contextName in response.data.contexts) {
                        if (response.data.contexts.hasOwnProperty(contextName)) {
                            this.tableDataList[contextName] = {
                                name: contextName,
                                parent: response.data.contexts[contextName].parentId,
                                data: []
                            };
                            this.tableDataList[contextName].data = this.tableDataList[contextName].data.concat(
                                map(response.data.contexts[contextName].positiveMatches, 'POSITIVE'));
                            this.tableDataList[contextName].data = this.tableDataList[contextName].data.concat(
                                map(response.data.contexts[contextName].negativeMatches, 'NEGATIVE'));
                            for (const idx in response.data.contexts[contextName].unconditionalClasses) {
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
        },
        computed: {
            rows() {
                if (!this.tab) {
                    return [];
                }
                if (this.typeFilters.length === 0) {
                    return this.tableDataList[this.tab].data;
                }
                this.pagination.page = 1;
                return this.tableDataList[this.tab].data.filter((value) => this.typeFilters.indexOf(value.type) > -1);
            },
            headers() {
                return [
                    {text: this.$t('beans.name'), value: 'name'},
                    {text: this.$t('common.type'), value: 'type'},
                    {text: this.$t('common.details'), value: 'none'}
                ];
            }
        }
    };
</script>
