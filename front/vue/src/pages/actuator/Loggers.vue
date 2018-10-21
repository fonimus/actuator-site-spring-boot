<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div @click="setLimit(50)"><span v-t="'loggers.title'"></span></div>
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
                    <span v-t="'filter.levels'"></span>
                    <span class="space badge pointer" @click="filter(level)"
                          v-bind:class="badge(level, levelFilter === level)" v-for="level in levels"
                          :key="level">{{level}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="effectiveLevel" slot-scope="props">
                        <span class="badge"
                              v-bind:class="badge(props.row.effectiveLevel)">{{props.row.effectiveLevel}}</span>
                    </div>
                    <div slot="configuredLevel" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.configuredLevel)">{{props.row.configuredLevel}}</span>
                    </div>
                    <div slot="update" slot-scope="props">
                        <span v-for="(level,value) of levels" :key="value" @click="update(props.row.name, level)"
                              class="pointer space badge" v-bind:class="badge(level)">{{level}}</span>
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
    import Vue from 'vue'

    export default {
        name: 'Loggers',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.loggers'),
                columns: ['name', 'configuredLevel', 'effectiveLevel', 'update'],
                levelFilter: null
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            options() {
              return this.buildTableOptions({
                  sortable: ['name', 'configuredLevel', 'effectiveLevel'],
                  filterByColumn: true,
                  filterable: ['name'],
                  columnsClasses: {
                      name: 'column-size-limited-500',
                      configuredLevel: 'column-size-limited-160 text-center',
                      effectiveLevel: 'column-size-limited-140 text-center',
                  },
                  headings: {
                      name: this.$t('common.name'),
                      configuredLevel: this.$t('loggers.configured-level'),
                      effectiveLevel: this.$t('loggers.effective-level')
                  },
                  customFilters: [{
                      name: 'byLevel',
                      callback: function (row, query) {
                          if (!query || query === 'all') {
                              return true;
                          }
                          return row.configuredLevel === query || row.effectiveLevel === query;
                      }
                  }]
              });
            },
            filter(level) {
                this.levelFilter = level;
                Event.$emit('vue-tables.filter::byLevel', level);
            },
            update: function(name, level) {
                this.loading = true;
                this.$api.loggerUpdate(name, level).then(() => {
                    this.$notify({group: 'general', type: 'success', title: 'Logger '+name+' updated'});
                }).catch(e => {
                    this.$log.error('Error while updating logger: ' + name, e);
                    this.$notify({group: 'general', type: 'error', title: 'Unable to update logger, please retry later'});
                    this.error = e
                }).finally(() => {
                    this.refresh()
                })
            },
            internalRefresh() {
                return this.$api.loggers().then(response => {
                    this.source = response.data;
                    this.levels = response.data.levels;
                    this.tableData = Object.keys(response.data.loggers).map(function (key, index) {
                        return Object.assign({id: index, name: key}, response.data.loggers[key])
                    });
                });
            }
        }
    }
</script>
