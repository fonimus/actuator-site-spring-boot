<template>
    <actuator-card :source="source" :refresh="refresh" url="/scheduledtasks">
        <template slot="title">
            <span v-t="'tasks.title'"></span>
        </template>
        <template slot="content">

            <v-layout justify-space-between class="filters">
                <div>
                    <span v-t="'filter.types'"></span>
                    <button-filter v-for="type in types" :key="type" :name="type"
                                   :on-select="activate.bind(this, typeFilters, type)"
                                   :on-remove="deactivate.bind(this, typeFilters, type)"
                                   :color="color(type)">

                    </button-filter>
                </div>

                <v-text-field class="search-field" v-model="search" append-icon="search" :label="$t('common.filter')"
                              single-line
                              hide-details></v-text-field>
            </v-layout>

            <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                          :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>
                        <v-btn small round :color="color(props.item.type)">{{ props.item.type }}</v-btn>
                    </td>
                    <td>
            <span v-if="props.item.type === 'CRON'">
              <span v-t="'tasks.expression'">Expression: </span>
              <v-btn small color="info" class="badge badge-info">{{props.item.original.expression}}</v-btn>
            </span>
                        <span v-else>
              <span v-t="'tasks.initial-delay'">Initial delay: </span>
              <v-btn small color="info" class="badge badge-info">{{props.item.original.initialDelay}}</v-btn>
              <span v-t="'tasks.interval'">Interval: </span>
              <v-btn small color="info" class="badge badge-info">{{props.item.original.interval}}</v-btn>
            </span>
                    </td>
                    <td>
                        <raw :raw="props.item.original"></raw>
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
                errorMessage: this.$t('error.get.tasks'),
                types: [],
                typeFilters: [],
                pagination: {sortBy: 'timestamp', descending: true, rowsPerPage: 10}
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.scheduledtasks().then((response) => {
                    this.source = response.data;
                    this.types = [];
                    this.tableData = [];
                    for (const type of Object.keys(response.data)) {
                        this.putIfAbsent(this.types, type.toUpperCase());
                        for (const item of response.data[type]) {
                            this.tableData.push({
                                name: item.runnable ? item.runnable.target : 'unknown',
                                type: type.toUpperCase(),
                                original: item
                            });
                        }
                    }
                });
            }
        },
        computed: {
            rows() {
                if (this.typeFilters.length === 0) {
                    return this.tableData;
                }
                this.pagination.page = 1;
                return this.tableData.filter((value) => this.typeFilters.indexOf(value.type) > -1);
            },
            headers() {
                return [
                    {text: this.$t('common.name'), value: 'name'},
                    {text: this.$t('common.type'), value: 'type'},
                    {text: this.$t('tasks.trigger'), value: 'trigger'},
                    {text: this.$t('common.details'), value: 'none'}
                ];
            }
        }
    };
</script>
