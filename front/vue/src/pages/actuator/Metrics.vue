<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'metrics.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer space" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
                <a target="_blank" rel="noopener noreferrer" href="../metrics">
                    <fa class="space" icon="share-square" v-b-tooltip.hover :title="$t('go.to')"/>
                </a>
            </div>
        </div>
        <div class="card-body">
            <p class="alert alert-primary">Coming soon ...</p>
        </div>
    </div>
</template>

<script>
    import Abstract from './Abstract.vue'

    export default {
        name: 'Metrics',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.metrics')
            }
        },
        methods: {
            internalRefresh() {
                return this.$api.metrics().then(response => {
                    this.source = response.data;
                });
            }
        }
    }
</script>
