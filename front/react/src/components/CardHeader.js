import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import Raw from "./Raw";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Icon from "@material-ui/core/Icon/Icon";
import CardActions from "@material-ui/core/CardActions/CardActions";

const styles = {
    grow: {
        flexGrow: 1,
    },
    customIconButton: {
        padding: '6px',
        margin: 0
    },
    customCardActions: {
        padding: '8px'
    }
};

class CardHeader extends Component {


    test() {
        this.props.refresh()
    }

    render() {
        const {classes, source, refresh, url, title} = this.props;

        return (
            <CardActions className={classes.customCardActions}>
                <Button variant="text">
                    {title}
                </Button>
                <div className={classes.grow}/>
                {source &&
                <Raw raw={source}/>
                }
                {refresh &&
                <IconButton className={classes.customIconButton} onClick={() => this.props.refresh()}>
                    <Tooltip title={<FormattedMessage id="refresh.data"/>}>
                        <Icon>refresh</Icon>
                    </Tooltip>
                </IconButton>
                }
                {url &&
                <IconButton className={classes.customIconButton} target="_blank" rel="noopener noreferrer"
                            href={'..' + url}>
                    <Tooltip title={<FormattedMessage id="go.to"/>}>
                        <Icon>launch</Icon>
                    </Tooltip>
                </IconButton>
                }
            </CardActions>
        );
    }
}

CardHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    source: PropTypes.any,
    refresh: PropTypes.func,
    url: PropTypes.string,
    title: PropTypes.any
};

export default withTheme()(withStyles(styles)(CardHeader));
