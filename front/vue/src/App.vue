<template>
    <v-app :dark="dark" v-if="ready">
        <!-- TODO is navigation required ?-->
        <!--<v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer"-->
        <!--enable-resize-watcher fixed app>-->
        <!--<v-list>-->
        <!--<v-list-tile value="true" v-for="(item, i) in items" :key="i">-->
        <!--<v-list-tile-action>-->
        <!--<v-icon v-html="item.icon"></v-icon>-->
        <!--</v-list-tile-action>-->
        <!--<v-list-tile-content>-->
        <!--<v-list-tile-title v-text="item.title"></v-list-tile-title>-->
        <!--</v-list-tile-content>-->
        <!--</v-list-tile>-->
        <!--</v-list>-->
        <!--</v-navigation-drawer>-->
        <v-toolbar app :clipped-left="clipped" color="primary">
            <!--<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>-->
            <!--<v-btn icon @click.stop="miniVariant = !miniVariant">-->
            <!--<v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>-->
            <!--</v-btn>-->
            <!-- TODO find logo -->
            <v-toolbar-title v-text="title" @click="home" class="pointer white--text"></v-toolbar-title>

            <v-menu offset-y v-if="paths.length > 0">
                <v-btn slot="activator" color="primary" depressed class="v-btn--header">
                    <v-icon left>settings</v-icon>
                    <span v-t="'header.admin'" class="hidden-sm-and-down"></span>
                    <v-icon left>arrow_drop_down</v-icon>
                </v-btn>
                <v-list color="primary">
                    <v-list-tile v-for="(path, index) in paths" :key="index" :to="'/'+ path">
                        <v-list-tile-title>{{$t('header.' + path)}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <v-menu offset-y>
                <v-btn slot="activator" color="primary" depressed class="v-btn--header">
                    <v-icon left>flag</v-icon>
                    <span v-t="'header.language'" class="hidden-sm-and-down"></span>
                    <v-icon left>arrow_drop_down</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="(display,key) of languages" :key="key" @click="setLanguage(key)"
                                 v-if="current() !== key">
                        <v-list-tile-title>{{display}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-menu offset-y>
                <v-btn slot="activator" color="primary" depressed class="v-btn--header">
                    <v-icon left>format_paint</v-icon>
                    <span v-t="'header.color'" class="hidden-sm-and-down"></span>
                    <v-icon left>arrow_drop_down</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="i in 4" :key="i">
                        <v-list-tile-title @click="switchColor(colors[i+((i-1)*4)+(j-2)])" v-for="j in 5" :key="j">
                            <v-icon dark v-bind:style="{color: colors[i+((i-1)*4)+(j-2)]}" class="space pointer">
                                check_circle
                            </v-icon>
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-tooltip bottom>
                <v-btn slot="activator" color="primary" depressed class="v-btn--header" @click="switchTheme">
                    <v-icon left>invert_colors</v-icon>
                    <span v-t="'header.theme'" class="hidden-sm-and-down"></span>
                </v-btn>
                <span v-if="dark">{{$t('header.theme.light')}}</span>
                <span v-if="!dark">{{$t('header.theme.dark')}}</span>
            </v-tooltip>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <router-view/>
            </v-container>
        </v-content>
        <v-footer height="50">
            <v-flex text-xs-center>
                <span>Copyright © {{ new Date().getFullYear() }} | </span>
                <a href="https://github.com/fonimus/actuator-site-spring-boot">
                    <span>Actuator site for Spring Boot</span>
                </a>
                <span> @ </span>
                <a href="https://github.com/fonimus">fonimus</a>
                <span v-if="version"> | v{{version}}</span>
                <span v-if="demo"> | Demo environment</span>
                <span v-if="vueVersion && vuetifyVersion"> | Powered by
                    <a href="https://vuejs.org/">Vuejs</a> v{{vueVersion}} and
                    <a href="https://vuetifyjs.com/">Vuetify</a> v{{vuetifyVersion}}
                </span>
            </v-flex>
        </v-footer>

        <v-snackbar v-model="snackbar.display" :color="snackbar.color" :timeout="snackbar.timeout">
            {{snackbar.text}}
            <v-btn dark flat icon @click="snackbar.display = false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import Vue from 'vue';

    import packageJson from '../package';

    function removeSpecial(value) {
        if (!value) {
            return value;
        }
        return value.replace('^', '').replace('~', '');
    }

    const PATHS = ['info', 'health', 'metrics', 'env', 'mappings', 'beans', 'configprops', 'loggers',
        'threaddump', 'conditions', 'httptrace', 'scheduledtasks', 'auditevents'];

    export default {
        data() {
            return {
                dark: true,
                colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
                    '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                    '#795548', '#607D8B', '#9E9E9E', '#333333'],
                clipped: true,
                drawer: false,
                fixed: true,
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Vue Boot',

                snackbar: {
                    display: false,
                    color: 'success',
                    timeout: 3000,
                    text: 'Test',
                },

                languages: {fr: 'Français', en: 'English'},
                ready: false,
                loading: false,
                source: null,
                error: null,
                paths: [],
                demo: false,
                version: null,
                vueVersion: null,
                vuetifyVersion: null
            };
        },
        methods: {
            home() {
                this.$router.push('/');
            },
            current() {
                return Vue.i18n.locale();
            },
            setLanguage(language) {
                this.$languages.changeLanguage(language).then(() => {
                    this.$cookies.set('VUEBOOT-LANGUAGE', language);
                    this.$vuetify.lang.current = language;
                });
            },
            displaySnackbar(text, color, timeout = 3000) {
                this.snackbar.text = text;
                this.snackbar.color = color;
                this.snackbar.timeout = timeout;
                this.snackbar.display = true;
            },
            switchTheme() {
                this.dark = !this.dark;
                this.$cookies.set('VUEBOOT-THEME', this.dark ? 'dark' : 'light');
                this.applyThemeToBody();
            },
            switchColor(color) {
                this.$vuetify.theme.primary = color;
                this.$cookies.set('VUEBOOT-COLOR', color);
            },
            applyThemeToBody() {
                if (this.dark) {
                    document.body.style.backgroundColor = '#303030';
                } else {
                    document.body.style.backgroundColor = '#fafafa';
                }
            },
        },
        mounted() {
            const languageFromCookies = this.$cookies.get('VUEBOOT-LANGUAGE');
            const language = languageFromCookies || 'en';
            const themeFromCookies = this.$cookies.get('VUEBOOT-THEME');
            if (themeFromCookies) {
                this.dark = themeFromCookies === 'dark';
            }
            this.applyThemeToBody();
            const colorFromCookies = this.$cookies.get('VUEBOOT-COLOR');
            this.$vuetify.theme.primary = colorFromCookies || '#607D8B';
            this.$languages.changeLanguage(language).finally(() => {
                this.$vuetify.lang.current = language;
                this.ready = true;
            });
        },
        created() {
            this.env = process.env.NODE_ENV;
            this.demo = process.env.VUE_APP_DEMO;
            this.version = process.env.VUE_APP_VERSION;
            let suffix = '';
            if (packageJson && packageJson.dependencies && packageJson.dependencies) {
                this.vueVersion = removeSpecial(packageJson.dependencies.vue);
                this.vuetifyVersion = removeSpecial(packageJson.dependencies.vuetify);
                suffix = ', vue v' + this.vueVersion + ', vuetify v' + this.vuetifyVersion;
            }
            this.$log.info('Running actuator website v' + this.version + suffix);
            if (this.env === 'development') {
                this.$log.info('Running in development environment');
            }
            if (this.demo === 'demo') {
                this.$log.info('Running demo environment specs');
            }

            Vue.prototype.$snack = {
                info: function (message, type, timeout) {
                    this.displaySnackbar(message, type, timeout);
                }.bind(this),
                success: function (message, timeout) {
                    this.displaySnackbar(message, 'success', timeout);
                }.bind(this),
                error: function (message, timeout) {
                    this.displaySnackbar(message, 'error', timeout);
                }.bind(this),
            };

            this.loading = true;
            this.$api.actuator().then((response) => {
                this.paths = [];
                for (const path of PATHS) {
                    if (response.data._links[path]) {
                        this.paths.push(path);
                    }
                }
                this.paths.sort();
            }).finally(() => {
                this.loading = false;
            });
        },
        name: 'App',
        actuator: PATHS
    };
</script>

<style lang="scss">
    .space {
        margin-right: 5px;
    }

    .pointer {
        cursor: pointer;
    }

    .filters {
        margin-bottom: 20px;
    }

    .table-shadow {
        border-radius: 4px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    }

    .v-window__container {
        padding-top: 10px;
    }

    .v-alert {
        border-radius: 5px;
    }

    .v-btn--xs {
        font-size: smaller;
        min-width: 30px;
    }

    .v-btn--no-transform {
        text-transform: unset;
    }

    .v-btn--no-transform .v-icon {
        font-size: medium;
        margin-left: 5px;
    }

    .v-btn--header {
        text-transform: unset;
        font-size: larger;
        padding: 0 5px;
        min-width: 20px;
    }

    .v-btn--header .v-icon {
        font-size: medium;
        margin-left: 5px;
        margin-right: 5px;
    }

    .v-alert {
        margin-bottom: 20px;
    }

    /* Progress */

    #nprogress {
        pointer-events: none;
    }

    #nprogress .bar {
        background: white;

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
        right: 0;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px white, 0 0 5px white;
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
        border-top-color: white;
        border-left-color: white;
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
</style>
