<template>
    <v-btn small round :color="color" :outline="!activated" @click="select" class="v-btn--no-transform">
        <span>{{name}}</span>
        <v-icon right v-if="activated" @click.stop="deselect">cancel</v-icon>
    </v-btn>
</template>

<script>
    export default {
        props: {
            color: String,
            name: String,
            onSelect: Function,
            onRemove: Function,
        },
        data() {
            return {
                activated: false,
            };
        },
        methods: {
            select() {
                this.activated = true;
                this.onSelect();
            },
            deselect() {
                this.activated = false;
                this.onRemove();
            }
        }
    };
</script>

<style>
    ul, ul li {
        list-style: none;
        margin-bottom: 5px;
    }
</style>
