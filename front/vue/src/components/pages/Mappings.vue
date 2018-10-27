<template>
  <actuator-card :source="source" :refresh="refresh" url="/mappings">
    <template slot="title">
      <span v-t="'mappings.title'"></span>
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
                  <span v-t="'filter.methods'"></span>
                  <button-filter v-for="method in methods" :key="method" :name="method"
                                 :on-select="activate.bind(this, methodFilters, method)"
                                 :on-remove="deactivate.bind(this, methodFilters, method)" :color="color(method)">

                  </button-filter>
                </div>

                <v-text-field class="search-field" v-model="search" append-icon="search" :label="$t('common.filter')"
                              single-line
                              hide-details>

                </v-text-field>
              </v-layout>

              <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                            :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
                <template slot="items" slot-scope="props">
                  <td>
                    <v-btn class="v-btn--no-transform" small round v-if="typeof props.item.patterns !== 'string'"
                           color="info" :key="pattern" v-for="pattern in props.item.patterns">{{pattern}}
                    </v-btn>
                    <v-btn class="v-btn--no-transform" small round v-if="typeof props.item.patterns === 'string'"
                           color="info">
                      {{props.item.patterns}}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn small round :color="color(method)" v-for="method in props.item.methods"
                           :key="method">{{ method }}
                    </v-btn>
                  </td>
                  <td>{{ props.item.class }}</td>
                  <td>{{ props.item.method }}</td>
                  <td>
                    <raw :raw="props.item.original"></raw>
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
  import Abstract from './Abstract.vue'

  export default {
    extends: Abstract,
    data () {
      return {
        errorMessage: this.$t('error.get.mappings'),
        methodFilters: [],
        pagination: {'rowsPerPage': 10}
      }
    },
    methods: {
      internalRefresh () {
        return this.$api.mappings().then(response => {
          this.source = response.data
          for (let contextName in response.data.contexts) {
            if (response.data.contexts.hasOwnProperty(contextName)) {
              this.tableDataList[contextName] = {
                name: contextName,
                parent: response.data.contexts[contextName].parentId,
                data: []
              }
              for (let dispatcherServletName in response.data.contexts[contextName].mappings.dispatcherServlets) {
                if (response.data.contexts[contextName].mappings.dispatcherServlets.hasOwnProperty(dispatcherServletName)) {
                  for (let mappingName in response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName]) {
                    if (response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName].hasOwnProperty(mappingName)) {
                      let originalMapping = response.data.contexts[contextName].mappings.dispatcherServlets[dispatcherServletName][mappingName]
                      const mapping = {
                        id: mappingName,
                        original: originalMapping
                      }
                      if (originalMapping.details) {
                        mapping.class = originalMapping.details.handlerMethod.className
                        mapping.method = originalMapping.details.handlerMethod.name
                        mapping.methods = originalMapping.details.requestMappingConditions.methods
                        mapping.patterns = originalMapping.details.requestMappingConditions.patterns
                      } else {
                        mapping.patterns = originalMapping.predicate
                      }
                      this.tableDataList[contextName].data.push(mapping)
                    }
                  }
                }
              }
            }
          }
        })
      }
    },
    computed: {
      rows: function () {
        if (!this.tab) {
          return []
        }
        if (this.methodFilters.length === 0) {
          return this.tableDataList[this.tab].data
        }
        this.pagination.page = 1
        return this.tableDataList[this.tab].data.filter(value => {
          if (value.methods) {
            for (let method of this.methodFilters) {
              if (value.methods.indexOf(method) !== -1) {
                return true
              }
            }
          }
          return false
        })
      },
      headers: function () {
        return [
          {text: this.$t('mappings.patterns'), value: 'patterns'},
          {text: this.$t('mappings.http-methods'), value: 'http-methods'},
          {text: this.$t('mappings.java-class'), value: 'java-class'},
          {text: this.$t('mappings.java-method'), value: 'java-method'},
          {text: this.$t('common.details'), value: 'none'}
        ]
      }
    }
  }
</script>
