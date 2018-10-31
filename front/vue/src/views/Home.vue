<template>
    <actuator-card>
        <template slot="title">
            <span v-t="'home.title'"></span>
        </template>
        <template slot="actions">
            <span></span>
        </template>
        <template slot="content">
            <p v-if="paths.length === 0" class="alert alert-warning" v-html="$t('home.no-endpoints')"></p>
            <div class="home-links">
                <v-btn round color="primary" v-for="(path,key) of paths" :key="key" :to="'/'+ path">{{$t('header.'+
                    path)}}
                </v-btn>
            </div>
        </template>
    </actuator-card>
</template>

<script>
    import App from '../App.vue';

    export default {
        name: 'Home',
        data() {
            return {
                paths: []
            };
        },
        created() {
            this.$api.actuator().then((response) => {
                this.paths = [];
                for (const path of App.actuator) {
                    if (response.data._links[path]) {
                        this.paths.push(path);
                    }
                }
                this.paths.sort();
            }).catch((e) => {
                this.$snack.error(this.$t('error.get.actuator'));
                this.$log.error('Error while available actuator endpoints: ', e);
                this.error = e;
            }).finally(() => {
                this.loading = false;
            });
        }
    };
</script>

<style scoped>
    .home-links {
        text-align: center;
        max-width: 1224px;
        margin: auto;
    }
</style>
