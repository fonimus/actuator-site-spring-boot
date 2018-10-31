import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import api from '../services/api';
import logger from '../services/logger';
import utils from '../services/utils';
import Raw from './Raw';
import ColoredButton from "./ColoredButton";
import {openSnackbar} from "./Notifier";

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
    },
    customCardContent: {
        padding: '16px'
    }
};

class AuditEvents extends Component {

    state = {
        source: null,
        tableData: [],
        types: [],
        loading: false,
        url: '/auditevents'
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.auditevents().then(response => {
            let types = [];
            for (let event of response.data.events) {
                utils.putIfAbsent(types, event.type)
            }
            this.setState({
                source: response.data,
                tableData: response.data.events,
                types: types
            })
        }).catch((e) => {
            logger.error("Error while loading audits", e);
            openSnackbar(<FormattedMessage id="error.get.audit"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    render() {
        const {classes} = this.props;
        const {url, source, tableData} = this.state;

        return (
            <div>
                <Card>
                    <CardActions className={classes.customCardActions}>
                        <Button variant="text">
                            <FormattedMessage id="audit.title"/>
                        </Button>
                        <div className={classes.grow}/>
                        {source &&
                        <Raw raw={source}/>
                        }
                        <IconButton className={classes.customIconButton} onClick={() => this.refresh()}>
                            <Tooltip title={<FormattedMessage id="refresh.data"/>}>
                                <Icon>refresh</Icon>
                            </Tooltip>
                        </IconButton>
                        <IconButton className={classes.customIconButton} target="_blank" rel="noopener noreferrer" href={'..' + url}>
                            <Tooltip title={<FormattedMessage id="go.to"/>}>
                                <Icon>launch</Icon>
                            </Tooltip>
                        </IconButton>
                    </CardActions>
                    <CardContent className={classes.customCardContent}>
                        {tableData.length > 0 &&
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><FormattedMessage id="common.timestamp"/></TableCell>
                                        <TableCell><FormattedMessage id="common.principal"/></TableCell>
                                        <TableCell><FormattedMessage id="common.type"/></TableCell>
                                        <TableCell><FormattedMessage id="common.message"/></TableCell>
                                        <TableCell><FormattedMessage id="common.details"/></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map(row => {
                                        return (
                                            <TableRow key={row.timestamp}>
                                                <TableCell>{row.timestamp}</TableCell>
                                                <TableCell>{row.principal}</TableCell>
                                                <TableCell>
                                                    <ColoredButton small={true} color={utils.color(row.type)}
                                                                   text={row.type}>
                                                    </ColoredButton>
                                                </TableCell>
                                                <TableCell>{row.data.message}</TableCell>
                                                <TableCell><Raw raw={row}/></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                        }
                    </CardContent>
                </Card>
            </div>
        );
    }
}

AuditEvents.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AuditEvents);
