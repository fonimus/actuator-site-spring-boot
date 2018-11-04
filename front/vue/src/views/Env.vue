<template>
  <actuator-card :source="source" :refresh="refresh" url="/env">
    <template slot="title">
      <span v-t="'env.title'"></span>
    </template>
    <template slot="content">

      <v-alert :value="true" type="info">
        <span v-if="profiles.length === 0" v-t="'env.no-profiles'"></span>
        <span v-else>
          <strong><span v-t="'env.profiles'"></span> : </strong>
          <span class="space" v-for="profile in profiles"
                :key="profile">{{profile}}</span>
        </span>
      </v-alert>

      <div>
        <span v-t="'filter.sources'"></span>
        <button-filter v-for="status in sources" :key="status" :name="status"
                       :on-select="activate.bind(this, sourceFilter, status)"
                       :on-remove="deactivate.bind(this, sourceFilter, status)"
                       :color="color(status)">

        </button-filter>
      </div>

      <v-text-field v-model="search" append-icon="search" :label="$t('common.filter')" single-line
                    hide-details></v-text-field>

      <v-data-table class="table-shadow" :headers="headers" :items="rows" :search="search" :loading="loading"
                    :pagination.sync="pagination" :rows-per-page-items="itemsPerPage">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.value }}</td>
          <td>
            <v-btn small round :color="color(props.item.source)" class="v-btn--no-transform">{{ props.item.source }}</v-btn>
          </td>
          <td>{{ props.item.origin }}</td>
        </template>
      </v-data-table>
    </template>
  </actuator-card>
</template>

<script>
  import Abstract from './Abstract.vue';

  function parse (from, properties) {
    return Object.keys(properties).map((key) => ({
        name: key,
        value: properties[key].value,
        source: from,
        origin: properties[key].origin
    }));
  }

  export default {
    extends: Abstract,
    data () {
      return {
        errorMessage: this.$t('error.get.health'),
        profiles: [],
        sources: [],
        sourceFilter: [],
        noDetails: false,
        pagination: {rowsPerPage: 10}
      };
    },
    methods: {
      internalRefresh () {
        return this.$api.env().then((response) => {
          this.source = response.data;
          this.profiles = response.data.activeProfiles;
          this.sources = [];
          for (const propertySource of response.data.propertySources) {
            this.sources.push(propertySource.name);
            this.tableData = this.tableData.concat(parse(propertySource.name, propertySource.properties));
          }
        });
      }
    },
    computed: {
      rows() {
        if (this.sourceFilter.length === 0) {
          return this.tableData;
        }
        this.pagination.page = 1;
        return this.tableData.filter((value) => this.sourceFilter.indexOf(value.source) > -1);
      },
      headers() {
        return [
          {text: this.$t('env.property-name'), value: 'name'},
          {text: this.$t('env.property-value'), value: 'value'},
          {text: this.$t('env.property-source'), value: 'source'},
          {text: this.$t('env.property-origin'), value: 'origin'}
        ];
      }
    }
  };
</script>
