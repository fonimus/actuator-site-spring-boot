import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import api from '../services/api';
import logger from '../services/logger';
import utils from '../services/utils';
import Raw from '../components/Raw';
import ColoredButton from "../components/ColoredButton";
import ButtonFilter from "../components/ButtonFilter";
import {openSnackbar} from "../components/Notifier";
import Typography from "@material-ui/core/Typography/Typography";
import CardHeader from "../components/CardHeader";
import CardTable from "../components/CardTable";
import CardBody from "../components/CardBody";

function status(allowed, aStatus) {
    if (!allowed || allowed.length === 0) {
        return true;
    }
    if (aStatus >= 200 && aStatus < 300) {
        return allowed.indexOf('2XX') !== -1;
    } else if (aStatus >= 300 && aStatus < 400) {
        return allowed.indexOf('3XX') !== -1;
    } else if (aStatus >= 400 && aStatus < 500) {
        return allowed.indexOf('4XX') !== -1;
    } else if (aStatus >= 500 && aStatus < 600) {
        return allowed.indexOf('5XX') !== -1;
    }
    return false;
}

function method(allowed, aMethod) {
    return !allowed || allowed.length === 0 || allowed.indexOf(aMethod) > -1;
}

class HttpTrace extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'timestamp', sortable: true, i18n: 'common.timestamp'},
            {id: 'response.status', sortable: true, i18n: 'common.status'},
            {id: 'timeTaken', sortable: true, i18n: 'trace.time-taken'},
            {id: 'request.method', sortable: true, i18n: 'common.method'},
            {id: 'request.uri', sortable: true, i18n: 'trace.uri'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        methodFilters: [],
        statusFilters: [],
        search: ''
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.httptrace().then(response => {
            this.setState({
                source: response.data
            })
        }).catch((e) => {
            logger.error("Error while loading traces", e);
            openSnackbar(<FormattedMessage id="error.get.trace"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (type, value, onSelect) => {
        switch (type) {
            case 'method':
                this.setState({methodFilters: utils.buildFilter(this.state.methodFilters, value, onSelect)});
                break;
            case 'status':
                this.setState({statusFilters: utils.buildFilter(this.state.statusFilters, value, onSelect)});
                break;
            default:
                return;
        }
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['timeTaken', 'request.uri', 'request.method', 'response.status']) &&
                method(this.state.methodFilters, value.request.method) &&
                status(this.state.statusFilters, value.response.status);
        })
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, loading, columns, search} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/httptrace" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"trace.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <FormattedMessage id="filter.methods"/>
                                {utils.methods.map((method, idx) => {
                                    return (
                                        <ButtonFilter key={idx} text={method} color={utils.color(method)}
                                                      onSelect={() => this.handleFilter('method', method, true)}
                                                      onDelete={() => this.handleFilter('method', method, false)}/>
                                    );
                                })}
                            </Typography>
                            <Typography component={"span"}>
                                <FormattedMessage id="filter.statuses"/>
                                {utils.statuses.map((status, idx) => {
                                    return (
                                        <ButtonFilter key={idx} text={status} color={utils.color(status)}
                                                      onSelect={() => this.handleFilter('status', status, true)}
                                                      onDelete={() => this.handleFilter('status', status, false)}/>
                                    );
                                })}
                            </Typography>
                            <Input id="search" type={"text"} className={"full-width"} value={search}
                                   onChange={this.handleChange} placeholder={this.searchPlaceHolder()}
                                   endAdornment={
                                       <InputAdornment position="end">
                                           <Icon>search</Icon>
                                       </InputAdornment>
                                   }
                            />
                        </div>
                        {source &&
                        <CardTable
                            data={source.traces} columns={columns} customFilter={this.filter}
                            initialOrder={"desc"} initialOrderBy={"timestamp"}
                            row={(row, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{row.timestamp}</TableCell>
                                        <TableCell>
                                            <ColoredButton size={"s"}
                                                           color={utils.color(row.response.status)}
                                                           text={row.response.status}>
                                            </ColoredButton>
                                        </TableCell>
                                        <TableCell>{row.timeTaken}</TableCell>
                                        <TableCell>
                                            <ColoredButton size={"s"}
                                                           color={utils.color(row.request.method)}
                                                           text={row.request.method}>
                                            </ColoredButton>
                                        </TableCell>
                                        <TableCell>{row.request.uri}</TableCell>
                                        <TableCell><Raw raw={row}/></TableCell>
                                    </TableRow>
                                )
                            }}/>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}

HttpTrace.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(HttpTrace));
