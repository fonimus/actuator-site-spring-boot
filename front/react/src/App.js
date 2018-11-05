import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes, {instanceOf} from 'prop-types';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Grid from "@material-ui/core/Grid/Grid";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Typography from "@material-ui/core/Typography/Typography";
import Icon from "@material-ui/core/Icon/Icon";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import PopupState, {bindMenu, bindTrigger} from 'material-ui-popup-state';
import {Cookies, CookiesProvider, withCookies} from 'react-cookie';
import axios from 'axios'
import nprogress from 'nprogress'
import {HashRouter, Link, NavLink, Route, Switch} from "react-router-dom";
import {addLocaleData, FormattedMessage, IntlProvider} from "react-intl";
import fr from "react-intl/locale-data/fr";
import es from "react-intl/locale-data/es";

import 'highlight.js/styles/dracula.css'

import Home from './pages/Home';
import AuditEvents from './pages/AuditEvents';
import HttpTrace from './pages/HttpTrace';
import NotFound from './pages/NotFound';
import api from './services/api';
import i18n from './services/i18n';
import logger from './services/logger';
import Notifier from './components/Notifier';
import ThreadDump from "./pages/ThreadDump";
import Info from "./pages/Info";
import ScheduledTasks from "./pages/ScheduledTasks";
import Metrics from "./pages/Metrics";
import Loggers from "./pages/Loggers";
import Health from "./pages/Health";
import Env from "./pages/Env";
import Conditions from "./pages/Conditions";
import Beans from "./pages/Beans";
import Mappings from "./pages/Mappings";
import ConfigProps from "./pages/ConfigProps";

import packageJson from './package-copied.json';

const PATHS = ['info', 'health', 'metrics', 'env', 'mappings', 'beans', 'configprops', 'loggers',
    'threaddump', 'conditions', 'httptrace', 'scheduledtasks', 'auditevents'];
const COOKIE_PREFIX = 'REACTBOOT-';

addLocaleData(fr);
addLocaleData(es);

function removeSpecial(value) {
    if (!value) {
        return value;
    }
    return value.replace('^', '').replace('~', '');
}

function initNProgres() {
    let requestsCounter = 0;

    nprogress.configure({showSpinner: false});

    axios.interceptors.request.use(function (config) {
        requestsCounter++;
        nprogress.start();
        return config
    });

    axios.interceptors.response.use(function (response) {
        if ((--requestsCounter) === 0) {
            nprogress.done()
        }
        return response
    }, function (error) {
        if ((--requestsCounter) === 0) {
            nprogress.done()
        }
        return Promise.reject(error)
    });
}

const styles = {
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        textTransform: 'unset',
        fontSize: 'medium',
        padding: '0 5px',
        minWidth: '20px',
        color: 'white',
        margin: '6px 8px'
    },
    menuButtonIcon: {
        fontSize: 'medium',
        marginLeft: '5px',
        marginRight: '5px'
    },
    menuItemColor: {
        cursor: 'unset',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    menuIconColor: {
        cursor: 'pointer'
    },
    footer: {
        height: '48px',
        bottom: 0,
        left: 0,
        width: '100%',
        position: 'fixed'
    },
    container: {
        flex: '1 1 100%',
        margin: 'auto',
        padding: '88px 24px 50px'
    },
    navLink: {
        textDecoration: 'unset',
        color: "inherit"
    }
};

class App extends Component {
    state = {
        loading: false,
        colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
            '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B',
            '#9E9E9E', '#333333'],
        color: '#607D8B',
        dark: true,
        theme: null,
        languages: {'fr': 'Français', 'en': 'English'},
        i18n: {
            locale: 'en',
            messages: {}
        },
        i18nMessages: {},
        adminAnchorEl: null,
        languageAnchorEl: null,
        colorAnchorEl: null,
        date: new Date().getFullYear(),
        env: process.env.NODE_ENV,
        demo: process.env.REACT_APP_DEMO,
        version: process.env.REACT_APP_VERSION,
        paths: [],
        ready: false,
        reactVersion: null,
        reactMaterialUiVersion: null
    };

    componentWillMount() {
        initNProgres();

        let suffix = '';
        let reactVersion = null;
        let reactMaterialUiVersion = null;
        if (packageJson && packageJson.dependencies && packageJson.dependencies) {
            reactVersion = removeSpecial(packageJson.dependencies.react);
            reactMaterialUiVersion = removeSpecial(packageJson.dependencies['@material-ui/core']);
            suffix = ', react v' + reactVersion + ', react-material-ui v' + reactMaterialUiVersion;
        }

        this.setState({loading: true, reactVersion, reactMaterialUiVersion});

        logger.info('Running actuator website v' + this.state.version + suffix);
        if (this.state.env === 'development') {
            logger.info('Running in development environment')
        }
        if (this.state.demo === 'demo') {
            logger.info('Running demo environment specs')
        }

        let languageFromCookies = this.props.cookies.get(COOKIE_PREFIX + 'LANGUAGE');

        this.onChangeLanguage(null, languageFromCookies || 'en');
        let themeFromCookies = this.props.cookies.get(COOKIE_PREFIX + 'THEME');
        let isDark = true;
        if (themeFromCookies) {
            isDark = themeFromCookies === 'dark';
        }
        if (!isDark) {
            this.setState({
                dark: isDark
            })
        }
        let colorFromCookies = this.props.cookies.get(COOKIE_PREFIX + 'COLOR');

        this.onChangeTheme(null, colorFromCookies || '#607D8B', isDark);
        App.applyThemeToBody(isDark);

        api.actuator().then(response => {
            let paths = [];
            for (let path of PATHS) {
                if (response.data._links) {
                    if (response.data._links[path]) {
                        paths.push(path)
                    }
                }
            }
            paths.sort();
            this.setState({paths: paths, loading: false});
        }).catch(() => {
            this.setState({loading: false});
        })
    }

    static applyThemeToBody(dark) {
        if (dark) {
            document.body.style.backgroundColor = '#303030'
        } else {
            document.body.style.backgroundColor = '#fafafa'
        }
    }

    onChangeDark = () => {
        let newType = this.state.dark ? 'light' : 'dark';
        this.props.cookies.set('REACTBOOT-THEME', newType, {path: '/'});
        this.setState(() => ({
            dark: !this.state.dark,
            theme: createMuiTheme({
                palette: {
                    primary: {
                        main: this.state.color
                    },
                    type: newType
                },
                typography: {
                    useNextVariants: true,
                }
            })
        }));
        App.applyThemeToBody(!this.state.dark);
    };

    onChangeLanguage = (state, locale) => {
        if (state) {
            state.close();
        }

        if (this.state.i18nMessages[locale]) {
            this.finalizeMessages(locale, this.state.i18nMessages[locale], false);
        } else {
            i18n.load(locale).then((response) => {
                this.finalizeMessages(locale, response.data, true);
            }).catch((e) => {
                logger.error('Error while getting translation: ' + locale, e);
                throw e
            })
        }
    };

    finalizeMessages = (locale, messages, saveInState) => {
        let state = {
            i18n: {
                locale: locale,
                messages: messages
            },
            ready: true
        };
        if (saveInState) {
            state.i18nMessages = {
                ...this.state.i18nMessages,
                [locale]: messages
            }
        }
        this.setState(state);
        this.props.cookies.set('REACTBOOT-LANGUAGE', locale, {path: '/'});
    };


    onChangeTheme = (state, color, type) => {
        if (state) {
            state.close();
        }
        let isDark = this.state.dark;
        if (type != null) {
            isDark = type;
        }
        let newType = isDark ? 'dark' : 'light';
        this.setState(() => ({
            color: color,
            theme: createMuiTheme({
                palette: {
                    primary: {
                        main: color
                    },
                    type: newType
                },
                typography: {
                    useNextVariants: true,
                }
            })
        }));
        this.props.cookies.set('REACTBOOT-COLOR', color, {path: '/'});
    };

    render() {
        const {
            theme, dark, color, colors, adminAnchorEl, colorAnchorEl, languageAnchorEl, date, version, demo, paths,
            i18n, languages, ready, loading, reactVersion, reactMaterialUiVersion
        } = this.state;
        const {classes} = this.props;
        return (
            <CookiesProvider>
                <IntlProvider locale={i18n.locale} messages={i18n.messages}>
                    <HashRouter>
                        {ready && !loading &&
                        <MuiThemeProvider theme={theme}>
                            <Notifier/>
                            <div>
                                <AppBar position="fixed">
                                    <Toolbar>
                                        <Link to="/" className={classes.navLink}>
                                            <Typography variant="h6" color="inherit">React Boot </Typography>
                                        </Link>
                                        {paths.length > 0 &&
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {popupState => (
                                                <React.Fragment>
                                                    <Button aria-owns={adminAnchorEl ? 'simple-menu' : null}
                                                            aria-haspopup="true" className={classes.menuButton}
                                                            {...bindTrigger(popupState)}>
                                                        <Icon className={classes.menuButtonIcon}>settings</Icon>
                                                        <FormattedMessage id="header.admin"/>
                                                        <Icon className={classes.menuButtonIcon}>arrow_drop_down</Icon>
                                                    </Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        {paths.map((path, i) =>
                                                            <MenuItem key={i}>
                                                                <NavLink to={'/' + path}
                                                                         activeStyle={{
                                                                             color: theme.palette.primary.main
                                                                         }}
                                                                         onClick={popupState.close}
                                                                         style={{width: '100%'}}
                                                                         className={classes.navLink}>
                                                                    <FormattedMessage color={"inherited"}
                                                                                      id={'header.' + path}/>
                                                                </NavLink>
                                                            </MenuItem>
                                                        )}
                                                    </Menu>
                                                </React.Fragment>
                                            )}
                                        </PopupState>
                                        }
                                        <div className={classes.grow}/>
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {popupState => (
                                                <React.Fragment>
                                                    <Button aria-owns={languageAnchorEl ? 'simple-menu' : null}
                                                            aria-haspopup="true" className={classes.menuButton}
                                                            {...bindTrigger(popupState)}>
                                                        <Icon className={classes.menuButtonIcon}>flag</Icon>
                                                        <FormattedMessage id="header.language"/>
                                                        <Icon className={classes.menuButtonIcon}>arrow_drop_down</Icon>
                                                    </Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        {Object.keys(languages).filter(lang => lang !== i18n.locale).map((lang, index) =>
                                                            <MenuItem key={index}
                                                                      onClick={() => this.onChangeLanguage(popupState, lang)}>
                                                                {languages[lang]}
                                                            </MenuItem>
                                                        )}
                                                    </Menu>
                                                </React.Fragment>
                                            )}
                                        </PopupState>
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {popupState => (
                                                <React.Fragment>
                                                    <Button aria-owns={colorAnchorEl ? 'simple-menu' : null}
                                                            aria-haspopup="true" className={classes.menuButton}
                                                            {...bindTrigger(popupState)}>
                                                        <Icon className={classes.menuButtonIcon}>format_paint</Icon>
                                                        <FormattedMessage id="header.color"/>
                                                        <Icon className={classes.menuButtonIcon}>arrow_drop_down</Icon>
                                                    </Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        {[1, 2, 3, 4].map((i) =>
                                                            <MenuItem key={i} className={classes.menuItemColor}>
                                                                {[1, 2, 3, 4, 5].map((j) =>
                                                                    <Icon key={j} className={classes.menuIconColor}
                                                                          onClick={() => this.onChangeTheme(popupState, colors[i + ((i - 1) * 4) + (j - 2)])}
                                                                          style={{color: colors[i + ((i - 1) * 4) + (j - 2)]}}
                                                                    >check_circle</Icon>
                                                                )}
                                                            </MenuItem>
                                                        )}
                                                    </Menu>
                                                </React.Fragment>
                                            )}
                                        </PopupState>
                                        <Tooltip title={dark
                                            ? <FormattedMessage id="header.theme.light"/>
                                            : <FormattedMessage id="header.theme.dark"/>
                                        }>
                                            <Button onClick={this.onChangeDark} className={classes.menuButton}>
                                                <Icon className={classes.menuButtonIcon}>invert_colors</Icon>
                                                <FormattedMessage id="header.theme"/>
                                            </Button>
                                        </Tooltip>
                                    </Toolbar>
                                </AppBar>
                            </div>
                            <div className={classes.container}>
                                <Switch>
                                    <Route path="/" exact component={Home}/>
                                    <Route path="/info" component={Info}/>
                                    <Route path="/health" component={Health}/>
                                    <Route path="/metrics" component={Metrics}/>
                                    <Route path="/env" component={Env}/>
                                    <Route path="/mappings" component={Mappings}/>
                                    <Route path="/beans" component={Beans}/>
                                    <Route path="/configprops" component={ConfigProps}/>
                                    <Route path="/loggers" component={Loggers}/>
                                    <Route path="/threaddump" component={ThreadDump}/>
                                    <Route path="/conditions" component={Conditions}/>
                                    <Route path="/httptrace" component={HttpTrace}/>
                                    <Route path="/scheduledtasks" component={ScheduledTasks}/>
                                    <Route path="/auditevents" component={AuditEvents}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </div>
                            <footer className={classes.footer}>
                                <AppBar position="sticky" color={"default"}>
                                    <Toolbar variant="dense">
                                        <Grid container direction="row" justify="center" alignItems="center">
                                            <Typography color="inherit" align="center">
                                                <span>Copyright © {date} | </span>
                                                <a href="https://github.com/fonimus/actuator-site-spring-boot"
                                                   style={{color: color}}>
                                                    <span>Actuator site for Spring Boot</span>
                                                </a>
                                                <span> @ </span>
                                                <a href="https://github.com/fonimus" style={{color: color}}>fonimus</a>
                                                {version &&
                                                <span> | v{version}</span>
                                                }
                                                {demo &&
                                                <span> | Demo environment</span>
                                                }
                                                {demo &&
                                                <span v-if="reactVersion && reactMaterialUiVersion"> | Powered by <a
                                                    style={{color: color}}
                                                    href="https://reactjs.org/">React</a> v{reactVersion} and <a
                                                    style={{color: color}} href="https://material-ui.com/">React material ui</a> v{reactMaterialUiVersion}
                                                </span>
                                                }
                                            </Typography>
                                        </Grid>
                                    </Toolbar>
                                </AppBar>
                            </footer>
                        </MuiThemeProvider>
                        }
                    </HashRouter>
                </IntlProvider>
            </CookiesProvider>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(withStyles(styles)(App));
