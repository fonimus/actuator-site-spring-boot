import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Icon from "@material-ui/core/Icon/Icon";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Highlight from 'react-highlight.js';
import {openSnackbar} from "./Notifier";

const styles = {
    customIconButton: {
        padding: '6px',
        margin: 0
    }
};

class Raw extends Component {

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleCopy = () => {
        openSnackbar(<FormattedMessage id="raw.copy.success"/>, 'success')
    };

    render() {
        const {raw, classes} = this.props;
        const {open} = this.state;
        const code = JSON.stringify(raw, null, 2);
        return (
            <div>
                <Tooltip title={<FormattedMessage id="raw.see-details"/>}>
                    <IconButton onClick={this.handleClickOpen} className={classes.customIconButton}>
                        <Icon>remove_red_eye</Icon>
                    </IconButton>
                </Tooltip>
                <Dialog
                    maxWidth={"lg"}
                    fullWidth={true}
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        <FormattedMessage id="raw.default.title"/>
                    </DialogTitle>
                    <DialogContent>
                        <div className={"highlight-raw"}>
                            <Highlight language={"json"}>
                                {code}
                            </Highlight>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <CopyToClipboard text={code} onCopy={this.handleCopy}>
                            <Button>
                                <FormattedMessage id="raw.default.button.copy"/>
                            </Button>
                        </CopyToClipboard>
                        <Button onClick={this.handleClose} autoFocus>
                            <FormattedMessage id="raw.default.button.close"/>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Raw.propTypes = {
    classes: PropTypes.object.isRequired,
    raw: PropTypes.object.isRequired
};

export default withStyles(styles)(Raw);
