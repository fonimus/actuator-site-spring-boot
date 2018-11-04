import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import Icon from "@material-ui/core/Icon/Icon";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton/IconButton";

const base = {
    padding: '6px',
    marginBottom: '10px',
    backgroundColor: 'red',
    borderRadius: '5px'
};

const styles = theme => ({
    success: {
        ...base,
        backgroundColor: green[600],
    },
    error: {
        ...base,
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        ...base,
        backgroundColor: '#2196f3',
    },
    warning: {
        ...base,
        backgroundColor: amber[700],
    }
});

class Alert extends Component {

    render() {
        const {classes, children, type} = this.props;
        let icon;
        switch (type) {
            case 'success':
                icon = 'check_circle';
                break;
            case 'warning':
                icon = 'priority_high';
                break;
            case 'error':
                icon = 'warning';
                break;
            default:
                icon = 'info';
                break;

        }

        return (
            <div className={classes[type]}>
                <Typography component={"span"}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <IconButton className={classes.button} aria-label="Delete">
                                <Icon>{icon}</Icon>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} sm>
                            {children}
                        </Grid>
                    </Grid>
                </Typography>
            </div>
        );
    }
}

Alert.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string
};

export default withStyles(styles)(Alert);
