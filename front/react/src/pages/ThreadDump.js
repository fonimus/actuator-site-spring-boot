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
import Grid from "@material-ui/core/Grid/Grid";

class ThreadDump extends Component {

    state = {
        source: null,
        states: [],
        loading: true,
        columns: [
            {id: 'threadId', sortable: true, i18n: 'dump.thread-id'},
            {id: 'threadName', sortable: true, i18n: 'dump.thread-name'},
            {id: 'threadState', sortable: true, i18n: 'dump.thread-state'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        stateFilters: [],
        search: ''
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.threaddump().then(response => {
            let states = [];
            for (const thread of response.data.threads) {
                utils.putIfAbsent(states, thread.threadState);
            }
            this.setState({
                source: response.data,
                states
            })
        }).catch((e) => {
            logger.error("Error while loading thread dumps", e);
            openSnackbar(<FormattedMessage id="error.get.dump"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['threadId', 'threadName', 'threadState']) &&
                utils.inFilter(this.state.stateFilters, value.threadState);
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({stateFilters: utils.buildFilter(this.state.stateFilters, value, onSelect)});
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, loading, columns, states} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/threaddump" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"dump.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <FormattedMessage id="filter.state"/>
                                        {states.map((state, idx) => {
                                            return (
                                                <ButtonFilter
                                                    key={idx} text={state} color={utils.color(state)}
                                                    onSelect={() => this.handleFilter(state, true)}
                                                    onDelete={() => this.handleFilter(state, false)}
                                                />
                                            );
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <Input id="search" type={"text"} className={"full-width"}
                                               value={this.state.search} placeholder={this.searchPlaceHolder()}
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
                        {source &&
                        <CardTable
                            data={source.threads} columns={columns} customFilter={this.filter}
                            initialOrder={"asc"} initialOrderBy={"threadId"}
                            row={(row, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{row.threadId}</TableCell>
                                        <TableCell>{row.threadName}</TableCell>
                                        <TableCell>
                                            <ColoredButton size={"s"}
                                                           color={utils.color(row.threadState)}
                                                           text={row.threadState}>
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

ThreadDump.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(ThreadDump));
