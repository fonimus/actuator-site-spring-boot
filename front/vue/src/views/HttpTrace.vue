<template>
    <actuator-card :source="source" :refresh="refresh" url="/auditevents">
        <template slot="title">
            <span v-t="'trace.title'"></span>
        </template>
        <template slot="content">
            <div class="filters">
                <div>
                    <span v-t="'filter.methods'"></span>
                    <button-filter v-for="method in methods" :key="method" :name="method"
                                   :on-select="activate.bind(this, methodFilters, method)"
                                   :on-remove="deactivate.bind(this, methodFilters, method)"
                                   :color="color(method)">

                    </button-filter>
                </div>
                <div>
                    <span v-t="'filter.statuses'"></span>
                    <button-filter v-for="status in statuses" :key="status" :name="status"
                                   :on-select="activate.bind(this, statusFilters, status)"
                                   :on-remove="deactivate.bind(this, statusFilters, status)"
                                   :color="color(status)">

                    </button-filter>
                </div>

                <v-text-field v-model="search" append-icon="search" :label="$t('common.filter')"
                              single-line hide-details>

                </v-text-field>
            </div>

            <v-data-table class="table-shadow" :headers="headers" :items="rows" :search="search" :loading="loading"
                          :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.timestamp | date}}</td>
                    <td>
                        <v-btn small round :color="color(props.item.response.status)">{{ props.item.response.status }}
                        </v-btn>
                    </td>
                    <td>{{ props.item.timeTaken }}</td>
                    <td>
                        <v-btn small round :color="color(props.item.request.method)">{{ props.item.request.method}}
                        </v-btn>
                    </td>
                    <td>{{ props.item.request.uri }}</td>
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

    function status(allowed, aStatus) {
        if (!allowed || allowed.length === 0) {
            return true;
        }
        if (aStatus >= 200 && aStatus < 300) {
            return allowed.indexOf('2XX') !== -1;
        } else if (aStatus >= 300 && aStatus < 400) {
            return allowed.indexOf('3XX') !== -1;
        } else if (aStatus >= 400 && aStatus < 500) {
            return allowed.indexOf('4XX') !== -1;
        } else if (aStatus >= 500 && aStatus < 600) {
            return allowed.indexOf('5XX') !== -1;
        }
        return false;
    }

    function method(allowed, aMethod) {
        return !allowed || allowed.length === 0 || allowed.indexOf(aMethod) > -1;
    }

    export default {
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.trace'),
                methodFilters: [],
                statuses: ['2XX', '3XX', '4XX', '5XX'],
                statusFilters: [],
                pagination: {sortBy: 'timestamp', descending: true, rowsPerPage: 10}
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.httptrace().then((response) => {
                    this.source = response.data;
                    this.tableData = response.data.traces;
                });
            }
        },
        computed: {
            rows() {
                if (this.methodFilters.length === 0 && this.statusFilters.length === 0) {
                    return this.tableData;
                }
                this.pagination.page = 1;
                return this.tableData.filter((value) =>
                    method(this.methodFilters, value.request.method) &&
                    status(this.statusFilters, value.response.status));
            },
            headers() {
                return [
                    {text: this.$t('common.timestamp'), value: 'timestamp'},
                    {text: this.$t('common.status'), value: 'response.status'},
                    {text: this.$t('trace.time-taken'), value: 'timeTaken'},
                    {text: this.$t('common.method'), value: 'request.method'},
                    {text: this.$t('trace.uri'), value: 'request.uri'},
                    {text: this.$t('common.details'), value: 'none'}
                ];
            }
        }
    };
</script>
