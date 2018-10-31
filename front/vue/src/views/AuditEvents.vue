<template>
  <actuator-card :source="source" :refresh="refresh" url="/auditevents">
    <template slot="title">
      <span v-t="'audit.title'"></span>
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

        <v-text-field class="search-field" v-model="search" append-icon="search" :label="$t('common.filter')" single-line
                      hide-details></v-text-field>
      </v-layout>

      <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                    :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.timestamp | date}}</td>
          <td>{{ props.item.principal }}</td>
          <td>
            <v-btn small round :color="color(props.item.type)">{{ props.item.type }}</v-btn>
          </td>
          <td>{{ props.item.data.message }}</td>
          <td><raw :raw="props.item"></raw></td>
        </template>
      </v-data-table>
    </template>
  </actuator-card>
</template>

<script>
  import Abstract from './Abstract.vue';

  export default {
    extends: Abstract,
    data () {
      return {
        errorMessage: this.$t('error.get.audit'),
        types: [],
        typeFilters: [],
        pagination: {sortBy: 'timestamp', descending: true, rowsPerPage: 10}
      };
    },
    methods: {
      internalRefresh () {
        return this.$api.auditevents().then((response) => {
          this.source = response.data;
          this.tableData = response.data.events;
          this.types = [];
          for (const event of response.data.events) {
            this.putIfAbsent(this.types, event.type);
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
          {text: this.$t('common.timestamp'), value: 'timestamp'},
          {text: this.$t('common.principal'), value: 'principal'},
          {text: this.$t('common.type'), value: 'type'},
          {text: this.$t('common.message'), value: 'message'},
          {text: this.$t('common.details'), value: 'none'}
        ];
      }
    }
  };
</script>
