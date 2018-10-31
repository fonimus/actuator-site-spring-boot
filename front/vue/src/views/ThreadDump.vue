<template>
    <actuator-card :source="source" :refresh="refresh" url="/threaddump">
        <template slot="title">
            <span v-t="'dump.title'"></span>
        </template>
        <template slot="content">

            <v-layout justify-space-between class="filters">
                <div>
                    <span v-t="'filter.state'"></span>
                    <button-filter v-for="state in states" :key="state" :name="state"
                                   :on-select="activate.bind(this, stateFilters, state)"
                                   :on-remove="deactivate.bind(this, stateFilters, state)"
                                   :color="color(state)">

                    </button-filter>
                </div>

                <v-text-field class="search-field" v-model="search" append-icon="search" :label="$t('common.filter')"
                              single-line hide-details>

                </v-text-field>
            </v-layout>

            <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                          :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.threadId }}</td>
                    <td>{{ props.item.threadName }}</td>
                    <td>
                        <v-btn small round :color="color(props.item.threadState)">{{ props.item.threadState }}</v-btn>
                    </td>
                    <td>
                        <raw :raw="props.item"></raw>
                    </td>
                </template>
            </v-data-table>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    export default {
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.dump'),
                states: [],
                stateFilters: [],
                pagination: {rowsPerPage: 10}
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.threaddump().then((response) => {
                    this.source = response.data;
                    this.tableData = response.data.threads;
                    this.states = [];
                    for (const thread of response.data.threads) {
                        this.putIfAbsent(this.states, thread.threadState);
                    }
                });
            }
        },
        computed: {
            rows() {
                if (this.stateFilters.length === 0) {
                    return this.tableData;
                }
                this.pagination.page = 1;
                return this.tableData.filter((value) => this.stateFilters.indexOf(value.threadState) > -1);
            },
            headers() {
                return [
                    {text: this.$t('dump.thread-id'), value: 'threadId'},
                    {text: this.$t('dump.thread-name'), value: 'threadName'},
                    {text: this.$t('dump.thread-state'), value: 'threadState'},
                    {text: this.$t('common.details'), value: 'none'}
                ];
            }
        }
    };
</script>
