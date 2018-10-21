<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'health.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <p v-if="noDetails" class="alert alert-warning" v-html="$t('health.no-details')"></p>
                <p class="alert alert-primary">
                    <span v-t="'filter.statuses'"></span>
                    <span class="space badge pointer" @click="filter('all')"
                          v-bind:class="badge('all', statusFilter === 'all')"><span v-t="'common.all'"></span></span>
                    <span class="space badge pointer" @click="filter(status)"
                          v-bind:class="badge(status, statusFilter === status)" v-for="status in statuses"
                          :key="status">{{status}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="status" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.status)">{{props.row.status}}</span>
                    </div>
                    <div slot="details" slot-scope="props">
                        <raw :raw="props.row.details"></raw>
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
        name: 'Health',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.health'),
                statuses: [],
                statusFilter: null,
                columns: ['name', 'status', 'details'],
                noDetails: false
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
                      details: 'column-size-limited-60 text-center',
                      status: 'column-size-limited-50 text-center'
                  },
                  headings: {
                      name: this.$t('common.name'),
                      status: this.$t('common.status'),
                      details: this.$t('common.details')
                  },
                  customFilters: [{
                      name: 'byStatus',
                      callback: function (row, query) {
                          if (!query || query === 'all') {
                              return true;
                          }
                          return row.status === query;
                      }
                  }]
              });
            },
            filter(status) {
                this.statusFilter = status;
                Event.$emit('vue-tables.filter::byStatus', status);
            },
            parse(data) {
                this.source = data;
                this.statuses = [];
                this.tableData = [];
                this.tableData.push({name: 'Global', status: data.status, details: data});
                if(data.details) {
                    this.tableData = this.tableData.concat(Object.keys(data.details).map(function (key) {
                        return Object.assign({name: key}, data.details[key])
                    }));
                } else {
                    this.noDetails = true;
                }
                for (let health of this.tableData) {
                    this.putIfAbsent(this.statuses, health.status);
                }
            },
            internalRefresh() {

                return this.$api.health().then(response => {
                    this.parse(response.data);
                }).catch((error) => {
                    if(error.response.data && error.response.data.status){
                        this.parse(error.response.data);
                        return;
                    }
                    throw error;
                });
            }
        }
    }
</script>
