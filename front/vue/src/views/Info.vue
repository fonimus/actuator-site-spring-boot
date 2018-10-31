<template>
    <actuator-card :source="source" :refresh="refresh" url="/info">
        <template slot="title">
            <span v-t="'info.title'"></span>
        </template>
        <template slot="content">
            <highlight-code lang="javascript" :code="code" class="highlight-code"></highlight-code>
        </template>
    </actuator-card>
</template>

<script>
    import Abstract from './Abstract.vue';

    export default {
        name: 'Info',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.info'),
                dark: false
            };
        },
        methods: {
            internalRefresh() {
                return this.$api.info().then((response) => {
                    this.source = response.data;
                });
            }
        },
        computed: {
            code() {
                return JSON.stringify(this.source, null, 2);
            }
        }
    };
</script>
