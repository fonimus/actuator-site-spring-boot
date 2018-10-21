<template>
    <div class="vue-spinner-outer" v-show="show">
        <div class="vue-spinner">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Spinner',
        props: {
            show: {
                default: false
            }
        }
    }
</script>
