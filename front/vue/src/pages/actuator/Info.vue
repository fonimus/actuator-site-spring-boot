<template>
    <div class="card card-page">
        <div class="card-header d-flex">
            <div><span v-t="'info.title'"></span></div>
            <div class="ml-auto">
                <raw :raw="source"></raw>
                <fa class="pointer" icon="sync" @click="!loading && refresh()" :spin="loading" v-b-tooltip.hover
                    :title="$t('refresh.data')"/>
            </div>
        </div>
        <div class="card-body">
            <div class="editor-auto" v-if="source">
                <codemirror ref="editor" :code="code" :options="editorOption()"></codemirror>
            </div>
        </div>
    </div>
</template>

<script>
    import Abstract from './Abstract.vue'
    import {codemirror} from 'vue-codemirror'

    export default {
        name: 'Info',
        extends: Abstract,
        data() {
            return {
                errorMessage: this.$t('error.get.info'),
                dark: false
            }
        },
        methods: {
            editorOption() {
                return {
                    readOnly: true,
                    tabSize: 2,
                    lineNumbers: true,
                    line: true,
                    mode: this.mode,
                    theme: this.$cookies.get('VUEBOOT-THEME') === 'dark' ? 'dracula' : 'mdn-like'

                }
            },
            internalRefresh() {
                return this.$api.info().then(response => {
                    this.source = response.data;
                });
            }
        },
        components: {
            codemirror
        },
        computed: {
            code() {
                return JSON.stringify(this.source, null, 2)
            }
        }
    }
</script>
