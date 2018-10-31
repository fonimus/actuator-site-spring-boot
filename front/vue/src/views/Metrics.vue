<template>
    <actuator-card :source="source" :refresh="refresh" url="/metrics">
        <template slot="title">
            <span v-t="'metrics.title'"></span>
        </template>
        <template slot="content">
            <v-alert :value="true" type="warning">Coming soon...</v-alert>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    export default {
        name: 'Metrics',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.metrics')
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.metrics().then((response) => {
                    this.source = response.data;
                });
            }
        }
    };
</script>
