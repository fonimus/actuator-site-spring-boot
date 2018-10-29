import React from 'react';
import {withStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

let openSnackbarFn;

const base = {
    borderRadius: 0
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
    },
    icon: {
        fontSize: 20,
        color: 'white'
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        color: 'white'
    },
});

class Notifier extends React.Component {
    state = {
        open: false,
        message: '',
        timeout: 3000,
        defaultTimeout: 3000,
        variant: 'info',
        defaultVariant: 'info',
        icon: null,
        defaultIcon: null,
    };

    componentDidMount() {
        openSnackbarFn = this.openSnackbar;
    }

    handleSnackbarClose = () => {
        this.setState({
            open: false,
            message: ''
        });
    };

    openSnackbar = (message, variant, icon, timeout) => {
        this.setState({
            open: true,
            message: message,
            icon: icon ? icon : this.state.defaultIcon,
            timeout: timeout ? timeout : this.state.defaultTimeout,
            variant: variant ? variant : this.state.defaultVariant
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={this.handleSnackbarClose}
                open={this.state.open}
                autoHideDuration={this.state.timeout}
                snackbarcontentprops={{'aria-describedby': 'snackbar-message-id'}}
            >
                <SnackbarContent className={classes[this.state.variant]}

                                 message={
                                     <span>
                                    {this.state.icon &&
                                    <Icon className={classes.icon}>{this.state.icon}</Icon>
                                    }
                                         <span id="client-snackbar" className={classes.message}>
                                    {this.state.message}
                                    </span>
                                 </span>
                                 }
                                 action={[
                                     <IconButton
                                         key="close"
                                         aria-label="Close"
                                         color="inherit"
                                         className={classes.close}
                                         onClick={this.handleSnackbarClose}
                                     >
                                         <Icon className={classes.icon}>close</Icon>
                                     </IconButton>,
                                 ]}

                />
            </Snackbar>
        );
    }
}

export function openSnackbar(message, variant, icon, timeout) {
    openSnackbarFn(message, variant, icon, timeout);
}

export default withStyles(styles)(Notifier);
