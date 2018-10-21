<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'tasks.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <p class="alert alert-primary">
                    <span v-t="'filter.types'"></span>
                    <span class="space badge pointer" @click="filter('all')"
                          v-bind:class="badge('all', typeFilter === 'all')"><span v-t="'common.all'"></span></span>
                    <span class="space badge pointer" @click="filter(type)"
                          v-bind:class="badge(type, typeFilter === type)" v-for="type in types"
                          :key="type">{{type}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="type" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.type)">{{props.row.type}}</span>
                    </div>
                    <div slot="trigger" slot-scope="props">
                        <span v-if="props.row.type === 'CRON'">
                            <span>Expression: </span>
                            <span class="badge badge-info">{{props.row.original.expression}}</span>
                        </span>
                        <span v-else>
                            <span>Initial delay: </span>
                            <span class="badge badge-info">{{props.row.original.initialDelay}}</span>
                            <span>, interval: </span>
                            <span class="badge badge-info">{{props.row.original.interval}}</span>
                        </span>
                    </div>
                    <div slot="details" slot-scope="props">
                        <raw :raw="props.row.original"></raw>
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
        name: 'ScheduledTasks',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.tasks'),
                types: [],
                typeFilter: null,
                columns: ['name', 'type', 'trigger', 'details']
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            options() {
              return this.buildTableOptions({
                  sortable: ['name'],
                  filterByColumn: true,
                  filterable: ['name'],
                  columnsClasses: {
                      details: 'column-size-limited-60 text-center'
                  },
                  headings: {
                      name: this.$t('common.name'),
                      type: this.$t('common.type'),
                      trigger: this.$t('tasks.trigger'),
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
            filter(type) {
                this.typeFilter = type;
                Event.$emit('vue-tables.filter::byType', type);
            },
            internalRefresh() {

                return this.$api.scheduledtasks().then(response => {
                    this.source = response.data;
                    this.types = [];
                    this.tableData = [];
                    for (let type of Object.keys(response.data)) {
                        this.putIfAbsent(this.types, type.toUpperCase());
                        for (let item of response.data[type]) {
                            this.tableData.push({
                                name: item.runnable ? item.runnable.target : 'unknown',
                                type: type.toUpperCase(),
                                original: item
                            });
                        }
                    }
                });
            }
        }
    }
</script>
