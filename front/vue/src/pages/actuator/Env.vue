<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'env.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../env">
                    <fa class="space" icon="share-square" v-b-tooltip.hover :title="$t('go.to')"/>
                </a>
            </div>
        </div>
        <div class="card-body">
            <spinner :show="loading"></spinner>
            <div v-if="!loading">
                <p class="alert alert-success">
                    <span v-t="'env.profiles'"></span>
                    <span class="space badge badge-success" v-for="profile in profiles"
                          :key="profile">{{profile}}</span>
                    <span v-if="profiles.length === 0" v-t="'env.no-profiles'"></span>
                </p>
                <p class="alert alert-primary">
                    <span v-t="'filter.sources'"></span>
                    <span class="space badge pointer" @click="filter('all')"
                          v-bind:class="badge('all', sourceFilter === 'all')"><span v-t="'common.all'"></span></span>
                    <span class="space badge pointer" @click="filter(source)"
                          v-bind:class="badge(source, sourceFilter === source)" v-for="source in sources"
                          :key="source">{{source}}</span>
                </p>
                <v-client-table ref="table" :data="tableData" :columns="columns" :options="options()">
                    <div slot="from" slot-scope="props">
                        <span class="badge" v-bind:class="badge(props.row.from)">{{props.row.from}}</span>
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

    function parse(from, properties) {
        return Object.keys(properties).map(function (key) {
            return {
                name: key,
                value: properties[key].value,
                from: from,
                origin: properties[key].origin
            };
        });
    }

    export default {
        name: 'Env',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.env'),
                profiles: [],
                sources: [],
                sourceFilter: null,
                columns: ['name', 'value', 'from', 'origin']
            }
        },
        updated() {
            this.singleTable();
        },
        methods: {
            options() {
              return this.buildTableOptions({
                  sortable: ['name', 'value', 'from'],
                  filterByColumn: true,
                  filterable: ['name', 'value'],
                  columnsClasses: {
                      value: 'column-size-limited-300',
                      from: 'text-center',
                  },
                  headings: {
                      name: this.$t('env.property-name'),
                      value: this.$t('env.property-value'),
                      from: this.$t('env.property-source'),
                      origin: this.$t('env.property-origin')
                  },
                  customFilters: [{
                      name: 'bySource',
                      callback: function (row, query) {
                          if (!query || query === 'all') {
                              return true;
                          }
                          return row.from === query;
                      }
                  }]
              });
            },
            filter(source) {
                this.sourceFilter = source;
                Event.$emit('vue-tables.filter::bySource', source);
            },
            internalRefresh() {
                return this.$api.env().then(response => {
                    this.source = response.data;
                    this.profiles = response.data.activeProfiles;
                    this.sources = [];
                    for (let propertySource of response.data.propertySources) {
                        this.sources.push(propertySource.name);
                        this.tableData = this.tableData.concat(parse(propertySource.name, propertySource.properties));
                    }
                });
            }
        }
    }
</script>
