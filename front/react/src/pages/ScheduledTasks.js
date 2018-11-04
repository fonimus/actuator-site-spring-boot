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

class ScheduledTasks extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'name', sortable: true, i18n: 'common.name'},
            {id: 'type', sortable: true, i18n: 'common.type'},
            {id: 'trigger', sortable: true, i18n: 'tasks.trigger'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        data: [],
        types: [],
        typeFilters: [],
        search: ''
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.scheduledtasks().then(response => {
            let types = [];
            let data = [];
            for (const type of Object.keys(response.data)) {
                utils.putIfAbsent(types, type.toUpperCase());
                for (const item of response.data[type]) {
                    data.push({
                        name: item.runnable ? item.runnable.target : 'unknown',
                        type: type.toUpperCase(),
                        original: item
                    });
                }
            }
            this.setState({
                source: response.data,
                data,
                types
            });
        }).catch((e) => {
            logger.error("Error while loading scheduled tasks", e);
            openSnackbar(<FormattedMessage id="error.get.tasks"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name', 'type']) &&
                utils.inFilter(this.state.typeFilters, value.type);
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({typeFilters: utils.buildFilter(this.state.typeFilters, value, onSelect)});
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, data, loading, columns, types} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/scheduledtasks" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"tasks.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <FormattedMessage id="filter.types"/>
                                        {types.map((type, idx) => {
                                            return (
                                                <ButtonFilter
                                                    key={idx} text={type} color={utils.color(type)}
                                                    onSelect={() => this.handleFilter(type, true)}
                                                    onDelete={() => this.handleFilter(type, false)}
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
                                                           color={utils.color(row.type)}
                                                           text={row.type}>
                                            </ColoredButton>
                                        </TableCell>
                                        <TableCell>
                                            {row.type === 'CRON' ?
                                                <Typography component={"span"}>
                                                    <FormattedMessage id="tasks.expression"/>
                                                    <ColoredButton variant={"contained"} color={utils.color('info')}>
                                                        {row.original.expression}
                                                    </ColoredButton>
                                                </Typography> :
                                                <Typography component={"span"}>
                                                    <FormattedMessage id="tasks.initial-delay"/>
                                                    <ColoredButton variant={"contained"} color={utils.color('info')}>
                                                        {row.original.initialDelay}
                                                    </ColoredButton>
                                                    <FormattedMessage id="tasks.interval"/>
                                                    <ColoredButton variant={"contained"} color={utils.color('info')}>
                                                        {row.original.interval}
                                                    </ColoredButton>
                                                </Typography>
                                            }
                                        </TableCell>
                                        <TableCell><Raw raw={row.original}/></TableCell>
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

ScheduledTasks.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(ScheduledTasks));
