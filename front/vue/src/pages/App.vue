<template>
    <div v-if="ready" v-bind:class="{ 'page-dark': dark }">

        <notifications group="general" position="top right" classes="notification-custom" :width="300" :duration="5000"
                       :speed="500"/>

        <b-modal ref="confirmModal" title="Confirm">
        </b-modal>

        <b-navbar toggleable="md" :type="dark ? 'dark': 'light'" :variant="dark ? 'dark': 'light'" sticky="true">

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-navbar-brand to="/">{{$t('header.title')}}</b-navbar-brand>

            <b-collapse is-nav id="nav_collapse">

                <b-navbar-nav>

                    <b-nav-item-dropdown v-if="paths.length > 0">
                        <template slot="button-content">
                            <fa icon="cog" class="space"/>
                            <span>{{$t('header.admin')}}</span>
                        </template>
                        <b-dropdown-item v-for="(path,key) of paths" :key="key" :to="'/admin/'+ path">
                            {{$t('header.'+path)}}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>

                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">

                    <b-nav-item-dropdown right>
                        <template slot="button-content">
                            <fa icon="flag" class="space"/>
                            <span>{{$t('header.language')}}</span>
                        </template>
                        <b-dropdown-item v-for="(display,key) of languages" :key="key"
                                         @click="setLanguage(key)" v-if="current() !== key">{{display}}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right>
                        <template slot="button-content">
                            <fa icon="paint-brush" class="space"/>
                            <span>{{$t('header.theme')}}</span>
                        </template>
                        <b-dropdown-item @click="switchTheme">
                            <span>
                                <span v-if="dark">{{$t('header.theme.light')}}</span>
                                <span v-if="!dark">{{$t('header.theme.dark')}}</span>
                            </span>
                        </b-dropdown-item>
                    </b-nav-item-dropdown>

                </b-navbar-nav>

            </b-collapse>
        </b-navbar>

        <br/>

        <keep-alive>
            <div class="container-fluid" v-bind:class="{ 'container-dark': dark }">
                <router-view v-cloak :dark="dark"></router-view>
            </div>
        </keep-alive>

        <!-- Footer -->
        <footer class="footer" v-bind:class="{ 'footer-dark': dark }">
            <div class="text-center py-3">
                <span>Copyright © {{ new Date().getFullYear() }} | </span>
                <a href="https://github.com/fonimus/vue-actuator-spring-boot">
                    <span>Vue Actuatorfor Spring Boot</span>
                </a>
                <span> @ </span>
                <a href="https://github.com/fonimus">fonimus</a>
                <span v-if="version"> | v{{version}}</span>
                <span v-if="demo"> | Demo environment</span>
            </div>
        </footer>
    </div>
</template>

<script>
    import Vue from 'vue'

    const PATHS = ['info', 'health', 'metrics', 'env', 'mappings', 'beans', 'configprops', 'loggers',
        'threaddump', 'conditions', 'httptrace', 'scheduledtasks', 'auditevents'];

    export default {
        name: 'App',
        actuator: PATHS,
        components: {},
        data: function () {
            return {
                languages: {'fr': 'Français', 'en': 'English'},
                ready: false,
                loading: false,
                source: null,
                error: null,
                paths: [],
                dark: false,
                demo: false
            }
        },
        methods: {
            current() {
                return Vue.i18n.locale()
            },
            setLanguage(language) {
                this.$languages.changeLanguage(language).then(() => {
                    this.$cookies.set('VUEBOOT-LANGUAGE', language);
                });
            },
            switchTheme() {
                this.dark = !this.dark;
                this.$cookies.set('VUEBOOT-THEME', this.dark ? 'dark' : 'light');
                this.applyTheme();
            },
            applyTheme() {
                if (this.dark) {
                    document.body.classList.add('page-dark-color')
                } else {
                    document.body.classList.remove('class', 'page-dark-color')
                }
            }
        },
        mounted() {
            let languageFromCookies = this.$cookies.get('VUEBOOT-LANGUAGE');
            let language = languageFromCookies ? languageFromCookies : 'en';
            this.$languages.changeLanguage(language).finally(() => {
                this.ready = true;
            });
            let themeFromCookies = this.$cookies.get('VUEBOOT-THEME');
            if (themeFromCookies) {
                this.dark = themeFromCookies === 'dark';
                this.applyTheme();
            }
        },
        created() {
            this.env = env;
            this.demo = demo;
            if (this.env === 'development') {
                this.languages['zn'] = '[dev] no-translations';
                this.$log.info('Running in developpement environment');
            }
            if (demo === 'demo') {
                this.$log.info('Running demo environment specs');
            }
            this.version = version;
            this.loading = true;
            this.$api.actuator().then(response => {
                this.paths = [];
                for (let path of PATHS) {
                    if (response.data._links[path]) {
                        this.paths.push(path);
                    }
                }
                this.paths.sort();
            }).catch(e => {
                this.$notify({group: 'general', type: 'error', title: this.$t('error.get.actuator')});
                this.$log.error('Error while available actuator endpoints: ', e);
                this.error = e
            }).finally(() => {
                this.loading = false
            })
        }
    }
</script>

<style lang="scss">

    $primary: #6800c1;
    $my-progress-color: $primary;

    $tooltip-max-width: 500px;

    $page-dark-bg: #232323;

    @import '~bootstrap/scss/bootstrap.scss';
    @import '~bootstrap-vue/dist/bootstrap-vue.css';
    @import '~spinners/stylesheets/spinners';

    .vue-spinner-outer {
        text-align: center;
        padding-top: 150px;
        padding-bottom: 150px;
    }

    .vue-spinner {
        @include spinner(6em, 1.2s, background rgba(0, 0, 0, .2), 4px solid $primary);
    }

    [v-cloak] {
        display: none;
    }

    .page-dark-color {
        background-color: $page-dark-bg;
    }

    .link-white {
        @extend .text-white;
        text-decoration: underline;
    }

    .page-dark {
        @extend .page-dark-color;
    }

    .page-dark .dropdown-menu {
        background-color: $page-dark-bg;
        color: $white;
    }

    .page-dark .dropdown-item {
        color: unset;
    }

    .page-dark .dropdown-item:hover, .page-dark .dropdown-item:focus {
        color: $white;
        background-color: rgba($primary, .4);
    }

    .page-dark .form-control {
        background-color: $page-dark-bg;
        color: $white;
    }

    .page-dark .modal-header, .page-dark .modal-body, .page-dark .modal-content, .page-dark .modal-footer {
        background-color: $page-dark-bg;
    }

    .page-dark a.page-link {
        background-color: $dark;
    }

    .page-dark .page-item.disabled .page-link {
        background-color: $page-dark-bg;
    }

    .page-dark .page-item.active .page-link {
        border-color: $white;
    }

    .container-dark, .container-dark table {
        @extend .text-white;
    }

    .container-dark a {
        @extend .link-white;
    }

    .container-dark .card-header {
        @extend .bg-dark;
        border-bottom: 1px solid white;
    }

    .container-dark .card-body {
        @extend .bg-dark;
    }

    .footer-dark {
        @extend .text-white;
        margin-top: 10px;
        border-top: $card-border-width solid $card-border-color;
    }

    .footer-dark a {
        @extend .link-white;
    }

    form {
        margin-bottom: 0;
    }

    .filters {
        margin-bottom: 20px;
    }

    .white-space-normal {
        white-space: normal;
    }

    /* Tools  */

    .pointer {
        cursor: pointer;
    }

    .tab-link {
        @extend .pointer;
        color: $primary;
        text-decoration: underline;
    }

    .space {
        margin-right: 10px;
    }

    /* Bootstrap overrides  */

    .bg-light {
        border-bottom: $card-border-width solid $card-border-color;
    }

    .nav-tabs {
        margin-bottom: 15px;
    }

    .nav-pills {
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid $primary;
    }

    /* Notifications  */

    .notification-custom {
        padding: 10px;
        margin: 5px 5px 0 0;

        font-size: 14px;

        color: #ffffff;
        background: #44A4FC !important;
        border-left: 5px solid #187FE7 !important;

        &.warn {
            background: #ffb648 !important;
            border-left-color: #f48a06 !important;
        }

        &.error {
            background: #E54D42 !important;
            border-left-color: #B82E24 !important;
        }

        &.success {
            background: #68CD86 !important;
            border-left-color: #42A85F !important;
        }
    }

    /* Progress */

    #nprogress {
        pointer-events: none;
    }

    #nprogress .bar {
        background: $my-progress-color;

        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;

        width: 100%;
        height: 2px;
    }

    /* Fancy blur effect */
    #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px $my-progress-color, 0 0 5px $my-progress-color;
        opacity: 1.0;

        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
    }

    #nprogress .spinner {
        display: block;
        position: fixed;
        z-index: 1031;
        top: 15px;
        right: 15px;
    }

    #nprogress .spinner-icon {
        width: 18px;
        height: 18px;
        box-sizing: border-box;

        border: solid 2px transparent;
        border-top-color: $my-progress-color;
        border-left-color: $my-progress-color;
        border-radius: 50%;

        -webkit-animation: nprogress-spinner 400ms linear infinite;
        animation: nprogress-spinner 400ms linear infinite;
    }

    .nprogress-custom-parent {
        overflow: hidden;
        position: relative;
    }

    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
        position: absolute;
    }

    @-webkit-keyframes nprogress-spinner {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes nprogress-spinner {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /* Tables */

    .sort::after {
        content: '\00A0\00A0\21C5';
    }

    .sort-up::after {
        content: '\00A0\00A0\2191';
    }

    .sort-down::after {
        content: '\00A0\00A0\2193';
    }

    .VueTables > .row {
        display: none;
    }

    .VuePagination {
        display: none;
    }

    .VuePagination__pagination {
        float: right;
    }

    .VueTables__child-row-toggler {
        width: 10px;
        height: 10px;
        line-height: 10px;
        display: block;
        margin: auto;
        text-align: center;
    }

    .VueTables__child-row-toggler--closed::before {
        @extend .pointer;
        content: "+";
    }

    .VueTables__child-row-toggler--open::before {
        @extend .pointer;
        content: "-";
    }

    @for $max from 1 through 50 {
        .column-size-limited-#{$max}0 {
            max-width: #{$max * 10}px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }


</style>
