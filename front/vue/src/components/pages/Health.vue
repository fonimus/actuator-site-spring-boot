<template>
  <actuator-card :source="source" :refresh="refresh" url="/health">
    <template slot="title">
      <span v-t="'health.title'"></span>
    </template>
    <template slot="content">

      <v-layout justify-space-between class="filters">
        <div>
          <span v-t="'filter.statuses'"></span>
          <button-filter v-for="status in statuses" :key="status" :name="status"
                         :on-select="activate.bind(this, statusFilter, status)"
                         :on-remove="deactivate.bind(this, statusFilter, status)"
                         :color="color(status)">

          </button-filter>
        </div>

        <v-text-field class="search-field" v-model="search" append-icon="search" :label="$t('common.filter')" single-line
                      hide-details></v-text-field>
      </v-layout>

      <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                    :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>
            <v-btn small round :color="color(props.item.status)">{{ props.item.status }}</v-btn>
          </td>
          <td>
            <raw :raw="props.item.details"></raw>
          </td>
        </template>
      </v-data-table>
    </template>
  </actuator-card>
</template>

<script>
  import Abstract from './Abstract.vue'

  export default {
    extends: Abstract,
    data () {
      return {
        errorMessage: this.$t('error.get.health'),
        statuses: [],
        statusFilter: [],
        noDetails: false,
        pagination: {'rowsPerPage': 10}
      }
    },
    methods: {
      parse (data) {
        this.source = data
        this.statuses = []
        this.tableData = []
        this.tableData.push({name: this.$t('health.global'), status: data.status, details: data})
        if (data.details) {
          this.tableData = this.tableData.concat(Object.keys(data.details).map(function (key) {
            return Object.assign({name: key}, data.details[key])
          }))
        } else {
          this.noDetails = true
        }
        for (let health of this.tableData) {
          this.putIfAbsent(this.statuses, health.status)
        }
      },
      internalRefresh () {
        return this.$api.health().then(response => {
          this.parse(response.data)
        }).catch((error) => {
          if (error.response.data && error.response.data.status) {
            this.parse(error.response.data)
            return
          }
          throw error
        })
      }
    },
    computed: {
      rows: function () {
        if (this.statusFilter.length === 0) {
          return this.tableData
        }
        this.pagination.page = 1
        return this.tableData.filter(value => this.statusFilter.indexOf(value.status) > -1)
      },
      headers: function () {
        return [
          {text: this.$t('common.name'), value: 'name'},
          {text: this.$t('common.status'), value: 'status'},
          {text: this.$t('common.details'), value: 'none'}
        ]
      }
    }
  }
</script>
