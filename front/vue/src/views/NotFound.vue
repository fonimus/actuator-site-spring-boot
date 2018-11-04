<template>
    <actuator-card>
        <template slot="title">
            <span v-t="'not-found.title'"></span>
        </template>
        <template slot="actions">
            <span></span>
        </template>
        <template slot="content">
            <div class="text-xs-center">
                <p>{{$t('not-found.content')}}</p>
            </div>
        </template>
    </actuator-card>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                user: {},
                error: null
            };
        }
    };
</script>
