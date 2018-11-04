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
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";

function map(matches, type) {
    return Object.keys(matches).map((key) => ({
        name: key,
        type,
        original: matches[key]
    }));
}

class Conditions extends Component {

    state = {
        source: null,
        types: ['POSITIVE', 'NEGATIVE', 'UNCONDITIONAL'],
        loading: true,
        columns: [
            {id: 'name', sortable: true, i18n: 'beans.name'},
            {id: 'type', sortable: true, i18n: 'common.type'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        typeFilters: [],
        search: '',
        tableDataList: {},
        tab: 0
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.conditions().then(response => {
            let tableDataList = [];
            for (const contextName in response.data.contexts) {
                if (response.data.contexts.hasOwnProperty(contextName)) {
                    tableDataList[contextName] = {
                        name: contextName,
                        parent: response.data.contexts[contextName].parentId,
                        data: []
                    };
                    tableDataList[contextName].data = tableDataList[contextName].data.concat(
                        map(response.data.contexts[contextName].positiveMatches, 'POSITIVE'));
                    tableDataList[contextName].data = tableDataList[contextName].data.concat(
                        map(response.data.contexts[contextName].negativeMatches, 'NEGATIVE'));
                    for (const idx in response.data.contexts[contextName].unconditionalClasses) {
                        if (response.data.contexts[contextName].unconditionalClasses.hasOwnProperty(idx)) {
                            tableDataList[contextName].data.push({
                                name: response.data.contexts[contextName].unconditionalClasses[idx],
                                type: 'UNCONDITIONAL'
                            });
                        }
                    }
                }
            }
            this.setState({source: response.data, tableDataList});
        }).catch((e) => {
            logger.error("Error while loading conditions", e);
            openSnackbar(<FormattedMessage id="error.get.conditions"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name']) &&
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
        this.setState({search: event.target.value,});
    };

    handleTabChange = (event, value) => {
        this.setState({tab: value});
    };


    render() {
        const {source, loading, columns, types, search, tableDataList, tab} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/conditions" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"conditions.title"}/>}/>
                    <CardBody loading={loading}>
                        {tableDataList && tableDataList[Object.keys(tableDataList)[tab]] &&
                        <div>
                            <Tabs value={tab} onChange={this.handleTabChange} indicatorColor="primary"
                                  textColor="primary">

                                {Object.keys(tableDataList).map((name) => {
                                    return (
                                        <Tab key={name}
                                             label={<span><FormattedMessage id="common.context"/> : {name}</span>}/>
                                    );
                                })}
                            </Tabs>
                            <div className={"filters"} style={{marginTop: '10px'}}>
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
                            <CardTable
                                data={tableDataList[Object.keys(tableDataList)[tab]].data} columns={columns}
                                customFilter={this.filter}
                                initialOrder={"asc"} initialOrderBy={"name"}
                                row={(row, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                <ColoredButton size={"s"} color={utils.color(row.type)}
                                                               text={row.type}>
                                                </ColoredButton>
                                            </TableCell>
                                            <TableCell><Raw raw={row}/></TableCell>
                                        </TableRow>
                                    )
                                }}/>
                        </div>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}

Conditions.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(Conditions));
