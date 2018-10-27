<template>
  <actuator-card :source="source" :refresh="refresh" url="/beans">
    <template slot="title">
      <span v-t="'beans.title'"></span>
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
                  <span v-t="'filter.scopes'"></span>
                  <button-filter v-for="scope in scopes" :key="scope" :name="scope"
                                 :on-select="activate.bind(this, scopeFilters, scope)"
                                 :on-remove="deactivate.bind(this, scopeFilters, scope)" :color="color(scope)">

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
                  <td class="column-max-name">{{ props.item.name }}</td>
                  <td>
                    <v-btn class="v-btn--no-transform" small round :color="color(props.item.scope)">{{ props.item.scope
                      }}
                    </v-btn>
                  </td>
                  <td class="column-max-name">{{ props.item.type }}</td>
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
  import Abstract from './Abstract.vue'

  export default {
    extends: Abstract,
    data () {
      return {
        errorMessage: this.$t('error.get.beans'),
        scopes: [],
        scopeFilters: [],
        pagination: {'rowsPerPage': 10}
      }
    },
    methods: {
      internalRefresh () {
        return this.$api.beans().then(response => {
          this.source = response.data
          for (let contextName in response.data.contexts) {
            if (response.data.contexts.hasOwnProperty(contextName)) {
              this.tableDataList[contextName] = {
                name: contextName,
                parent: response.data.contexts[contextName].parentId,
                data: []
              }
              for (let beanName in response.data.contexts[contextName].beans) {
                if (response.data.contexts[contextName].beans.hasOwnProperty(beanName)) {
                  const bean = {
                    name: beanName
                  }
                  Object.assign(bean, response.data.contexts[contextName].beans[beanName])
                  this.putIfAbsent(this.scopes, bean.scope)
                  this.tableDataList[contextName].data.push(bean)
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
        if (this.scopeFilters.length === 0) {
          return this.tableDataList[this.tab].data
        }
        this.pagination.page = 1
        return this.tableDataList[this.tab].data.filter(value => this.scopeFilters.indexOf(value.scope) > -1)
      },
      headers: function () {
        return [
          {text: this.$t('beans.name'), value: 'name'},
          {text: this.$t('beans.scope'), value: 'scope'},
          {text: this.$t('common.type'), value: 'type'},
          {text: this.$t('common.details'), value: 'none'}
        ]
      }
    }
  }
</script>
