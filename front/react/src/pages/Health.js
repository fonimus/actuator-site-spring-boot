import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage, FormattedHTMLMessage, injectIntl, intlShape} from "react-intl";
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
import Grid from "@material-ui/core/Grid/Grid";
import Alert from "../components/Alert";

class Health extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'name', sortable: true, i18n: 'common.name'},
            {id: 'status', sortable: true, i18n: 'common.status'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        data: [],
        statuses: [],
        statusFilters: [],
        noDetails: false,
        search: ''
    };

    componentDidMount() {
        this.refresh();
    };

    parse(responseData) {
        let statuses = [];
        let data = [];
        let noDetails = false;
        data.push({
            name: this.props.intl.formatMessage({id: 'health.global'}),
            status: responseData.status,
            details: responseData
        });
        if (responseData.details) {
            data = data.concat(Object.keys(responseData.details)
                .map((key) => Object.assign({name: key}, responseData.details[key])));
        } else {
            noDetails = true;
        }
        for (const health of data) {
            utils.putIfAbsent(statuses, health.status);
        }
        this.setState({
            source: responseData,
            statuses, data, noDetails
        });
    };

    refresh() {
        this.setState({loading: true});
        api.health().then(response => {
            this.parse(response.data);
        }).catch((e) => {
            if (e.response && e.response.data && e.response.data.status) {
                this.parse(e.response.data);
                return;
            }
            logger.error("Error while loading health", e);
            openSnackbar(<FormattedMessage id="error.get.health"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({statusFilters: utils.buildFilter(this.state.statusFilters, value, onSelect)});
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name']) &&
                utils.inFilter(this.state.statusFilters, value.status);
        })
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, loading, columns, statuses, search, data, noDetails} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/health" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"health.title"}/>}/>
                    <CardBody loading={loading}>
                        {noDetails &&
                        <Alert type={"warning"}>
                            <FormattedHTMLMessage id="health.no-details"/>
                        </Alert>
                        }
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <FormattedMessage id="filter.statuses"/>
                                        {statuses.map((status, idx) => {
                                            return (
                                                <ButtonFilter key={idx} text={status} color={utils.color(status)}
                                                              onSelect={() => this.handleFilter(status, true)}
                                                              onDelete={() => this.handleFilter(status, false)}/>
                                            );
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <Input id="search" type={"text"} className={"full-width"}
                                               value={search} placeholder={this.searchPlaceHolder()}
                                               onChange={this.handleChange}
                                               endAdornment={
                                                   <InputAdornment position="end">
                                                       <Icon>search</Icon>
                                                   </InputAdornment>
                                               }
                                        />
                                    </Grid>
                                </Grid>
                            </Typography>
                        </div>
                        {data &&
                        <CardTable
                            data={data} columns={columns} customFilter={this.filter}
                            initialOrder={"asc"} initialOrderBy={"name"}
                            row={(row, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            <ColoredButton size={"s"}
                                                           color={utils.color(row.status)}
                                                           text={row.status}>
                                            </ColoredButton>
                                        </TableCell>
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

Health.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(Health));
