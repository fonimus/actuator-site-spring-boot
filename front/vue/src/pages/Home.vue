<template>
    <div class="card card-page">
        <div class="card-header">Home</div>
        <div class="card-body">
            <p v-if="paths.length === 0" class="alert alert-warning" v-html="$t('home.no-endpoints')"></p>
            <ul>
                <li v-for="(path,key) of paths" :key="key">
                    <a :href="'#/admin/'+ path">{{$t('header.'+path)}}</a>
                </li>
            </ul>
            <!--            <pie :data="{labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                    datasets: [{label: 'Data One',backgroundColor: '#f87979',
                                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]}]}"
                             :options="{responsive: true, maintainAspectRatio: false}">
                        </pie>-->
        </div>
    </div>
</template>

<script>
    import App from './App.vue'

    export default {
        name: 'Home',
        data() {
            return {
                paths: []
            }
        },
        created() {
            this.$api.actuator().then(response => {
                this.paths = [];
                for (let path of App.actuator) {
                    if (response.data._links[path]) {
                        this.paths.push(path);
                    }
                }
                this.paths.sort();
            })
        }
    }
</script>
