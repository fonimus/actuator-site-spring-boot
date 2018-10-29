import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {withTheme} from '@material-ui/core/styles';

import api from "../services/api";
import ColoredButton from './ColoredButton';
import {openSnackbar} from "./Notifier";

const styles = {
    navLink: {
        textDecoration: 'unset',
        color: "inherit"
    }
};

const PATHS = ['info', 'health', 'metrics', 'env', 'mappings', 'beans', 'configprops', 'loggers',
    'threaddump', 'conditions', 'httptrace', 'scheduledtasks', 'auditevents'];

class Home extends Component {
    state = {
        loading: false,
        paths: []
    };

    componentDidMount() {
        this.setState({loading: true});

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
            this.setState({paths: paths});
        }).catch(() => {
            openSnackbar(<FormattedMessage id="error.get.actuator"/>, 'error')
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    render() {
        const {paths} = this.state;
        const {classes, theme} = this.props;

        return (
            <div>
                <Card>
                    <CardActions>
                        <Button variant="text">
                            <FormattedMessage id={'home.title'}/>
                        </Button>
                    </CardActions>
                    <CardContent>
                        {paths.length === 0 &&
                        <Typography align="center">No endpoints</Typography>
                        }
                        <div className="home-links">
                            {paths.sort().map((path, index) =>
                                <NavLink to={'/' + path} key={index} className={classes.navLink}>
                                    <ColoredButton color={theme.palette.primary.main} text={<FormattedMessage id={'header.' + path}/>}>
                                    </ColoredButton>
                                </NavLink>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withTheme()(withStyles(styles)(Home));
