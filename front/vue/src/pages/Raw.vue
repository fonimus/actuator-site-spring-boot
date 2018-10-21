<template>
    <div class="raw">
        <fa icon="eye" class="pointer space" v-if="raw" @click="show" v-b-tooltip.hover :title="$t('raw.see-details')"/>
        <fa icon="eye-slash" class="space" v-if="!raw" v-b-tooltip.hover :title="$t('raw.no-details')"/>
        <b-modal ref="rawModalRef" size="lg">
            <div slot="modal-title">{{title}}</div>
            <div class="editor-auto text-left">
                <codemirror ref="editor" :code="code" :options="editorOption()"></codemirror>
            </div>
            <div slot="modal-footer" class="text-right">
                <button v-if="showCopy" class="pointer btn btn-primary"
                        v-clipboard:copy="code"
                        v-clipboard:success="success"
                        v-clipboard:error="error">
                    {{copyBtn}}
                </button>
                <button type="button" class="pointer btn btn-secondary" @click="close">{{closeBtn}}</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {codemirror} from 'vue-codemirror'

    export default {
        components: {
            codemirror
        },
        mounted() {
            this.updateTranslations();
        },
        props: {
            show: {
                default: false
            },
            title: {
                default: null
            },
            size: {
                default: 'modal-lg'
            },
            raw: {
                default: null
            },
            mode: {
                default: 'text/javascript'
            },
            showCopy: {
                default: true
            },
            copyBtn: {
                default: null
            },
            closeBtn: {
                default: null
            }
        },
        beforeUpdate() {
            this.updateTranslations();
        },
        methods: {
            updateTranslations() {
                this.title = this.$t('raw.default.title');
                this.copyBtn = this.$t('raw.default.button.copy');
                this.closeBtn = this.$t('raw.default.button.close');
            },
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
            success() {
                this.$notify({group: 'general', type: 'success', title: this.$t('raw.copy.success')})
            },
            error() {
                this.$notify({group: 'general', type: 'error', title: this.$t('raw.copy.error')})
            },
            show() {
                this.$refs.rawModalRef.show();
                setTimeout(() => this.$refs.editor.refresh(), 1);
            },
            close() {
                this.$refs.rawModalRef.hide();
            }
        },
        computed: {
            code() {
                return JSON.stringify(this.raw, null, 2)
            }
        }
    }
</script>

<style lang="scss">
    .raw {
        display: inline-block;
    }
</style>

