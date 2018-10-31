<template>
    <actuator-card :source="source" :refresh="refresh" url="/loggers">
        <template slot="title">
            <span v-t="'trace.title'"></span>
        </template>
        <template slot="content">

            <v-layout justify-space-between class="filters">
                <div>
                    <span v-t="'filter.levels'"></span>
                    <button-filter v-for="level in levels" :key="level" :name="level"
                                   :on-select="activate.bind(this, levelFilters, level)"
                                   :on-remove="deactivate.bind(this, levelFilters, level)"
                                   :color="color(level)">

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
                        <v-btn small round :color="color(props.item.effectiveLevel)">{{ props.item.effectiveLevel }}
                        </v-btn>
                    </td>
                    <td>
                        <v-btn v-if="props.item.configuredLevel" small round :color="color(props.item.configuredLevel)">
                            {{ props.item.configuredLevel }}
                        </v-btn>
                    </td>
                    <td>
                        <v-btn small round :color="color(level)" v-for="(level,value) of levels" :key="value"
                               @click="confirm(props.item.name, level)" class="v-btn--xs">
                            {{level}}
                        </v-btn>
                    </td>
                </template>
            </v-data-table>

            <v-dialog v-model="dialog" width="600">
                <v-card>
                    <v-card-title class="headline">
                        <span v-t="'common.confirmation'"></span>
                    </v-card-title>

                    <v-card-text>
            <span v-if="!dialogLoading"
                  v-html="$t('loggers.update.confirm-message', { name: update.name, level: update.level })"></span>
                        <v-progress-linear v-if="dialogLoading"
                                           indeterminate
                                           color="white"
                                           class="mb-0"
                        ></v-progress-linear>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn flat="flat" @click="dialog = false">
                            <span v-t="'common.cancel'"></span>
                        </v-btn>

                        <v-btn flat="flat" :disabled="dialogLoading" :loading="dialogLoading"
                               @click="updateLevel(update.name, update.level)">
                            <span v-t="'common.confirm'"></span>
                        </v-btn>

                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    export default {
        extends: Abstract,
        data() {
            return {
                dialog: false,
                errorMessage: this.$t('error.get.loggers'),
                levels: [],
                levelFilters: [],
                pagination: {rowsPerPage: 10},
                update: {
                    name: '',
                    level: ''
                }
            };
        },
        methods: {
            confirm(name, level) {
                this.update = {
                    name,
                    level
                };
                this.dialog = true;
            },
            updateLevel(name, level) {
                this.dialogLoading = true;
                this.$api.loggerUpdate(name, level).then(() => {
                    this.$snack.success(this.$t('logger.update.success'));
                }).catch((e) => {
                    this.$log.error('Error while updating logger: ' + name, e);
                    this.$snack.error(this.$t('logger.update.error'));
                    this.error = e;
                }).finally(() => {
                    this.dialog = false;
                    this.refresh();
                });
            },
            internalRefresh() {
                return this.$api.loggers().then((response) => {
                    this.source = response.data;
                    this.levels = response.data.levels;
                    this.tableData = Object.keys(response.data.loggers).map((key, index) => Object.assign({
                        id: index,
                        name: key
                    }, response.data.loggers[key]));
                });
            }
        },
        computed: {
            rows() {
                if (this.levelFilters.length === 0) {
                    return this.tableData;
                }
                this.pagination.page = 1;
                return this.tableData.filter((value) =>
                    this.levelFilters.indexOf(value.configuredLevel) > -1 ||
                    this.levelFilters.indexOf(value.effectiveLevel) > -1);
            },
            headers() {
                return [
                    {text: this.$t('common.name'), value: 'name'},
                    {text: this.$t('loggers.configured-level'), value: 'configuredLevel'},
                    {text: this.$t('loggers.effective-level'), value: 'effectiveLevel'},
                    {text: this.$t('loggers.update'), value: 'none'}
                ];
            }
        }
    };
</script>
