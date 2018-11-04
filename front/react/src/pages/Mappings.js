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

class Mappings extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'patterns', sortable: true, i18n: 'mappings.patterns'},
            {id: 'methods', sortable: true, i18n: 'mappings.http-methods'},
            {id: 'class', sortable: true, i18n: 'mappings.java-class'},
            {id: 'method', sortable: true, i18n: 'mappings.java-method'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        methodFilters: [],
        search: '',
        tableDataList: {},
        tab: 0
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.mappings().then(response => {
            let tableDataList = [];
            for (const contextName in response.data.contexts) {
                if (response.data.contexts.hasOwnProperty(contextName)) {
                    tableDataList[contextName] = {
                        name: contextName,
                        parent: response.data.contexts[contextName].parentId,
                        data: []
                    };
                    for (const dispatcherServletName in response.data.contexts[contextName]
                        .mappings.dispatcherServlets) {
                        if (response.data.contexts[contextName].mappings.dispatcherServlets
                            .hasOwnProperty(dispatcherServletName)) {
                            for (const mappingName in response.data.contexts[contextName]
                                .mappings.dispatcherServlets[dispatcherServletName]) {
                                if (response.data.contexts[contextName].mappings
                                    .dispatcherServlets[dispatcherServletName].hasOwnProperty(mappingName)) {
                                    const originalMapping = response.data.contexts[contextName]
                                        .mappings.dispatcherServlets[dispatcherServletName][mappingName];
                                    const mapping = {
                                        id: mappingName,
                                        original: originalMapping
                                    };
                                    if (originalMapping.details) {
                                        mapping.class = originalMapping.details
                                            .handlerMethod.className;
                                        mapping.method = originalMapping.details
                                            .handlerMethod.name;
                                        mapping.methods = originalMapping.details
                                            .requestMappingConditions.methods;
                                        mapping.patterns = originalMapping.details
                                            .requestMappingConditions.patterns;
                                    } else {
                                        mapping.patterns = originalMapping.predicate;
                                    }
                                    tableDataList[contextName].data.push(mapping);
                                }
                            }
                        }
                    }
                }
            }
            this.setState({source: response.data, tableDataList});
        }).catch((e) => {
            logger.error("Error while loading mappings", e);
            openSnackbar(<FormattedMessage id="error.get.mappings"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    filter = (list) => {
        return list.filter((value) => {
            let inFilters = true;
            if(this.state.methodFilters && this.state.methodFilters.length > 0) {
                inFilters = false;
                if (value.methods) {
                    for (const method of this.state.methodFilters) {
                        if (value.methods.indexOf(method) !== -1) {
                            inFilters = true;
                        }
                    }
                }
            }
            return inFilters && utils.search(this.state.search, value, ['patterns', 'methods', 'class', 'method']);
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({methodFilters: utils.buildFilter(this.state.methodFilters, value, onSelect)});
    };

    handleChange = (event) => {
        this.setState({search: event.target.value,});
    };

    handleTabChange = (event, value) => {
        this.setState({tab: value});
    };


    render() {
        const {source, loading, columns, search, tableDataList, tab} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/mappings" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"mappings.title"}/>}/>
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
                                            <FormattedMessage id="filter.methods"/>
                                            {utils.methods.map((method, idx) => {
                                                return (
                                                    <ButtonFilter
                                                        key={idx} text={method} color={utils.color(method)}
                                                        onSelect={() => this.handleFilter(method, true)}
                                                        onDelete={() => this.handleFilter(method, false)}
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
                                initialOrder={"asc"} initialOrderBy={"patterns"}
                                row={(row, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {typeof row.patterns === 'string' &&
                                                <ColoredButton size={"s"} color={utils.color('info')}
                                                               text={row.patterns} noTransform={true}>
                                                </ColoredButton>
                                                }
                                                {typeof row.patterns !== 'string' && row.patterns.map((pattern, idx) => {
                                                    return (
                                                        <ColoredButton key={idx} size={"s"} color={utils.color('info')}
                                                                       text={pattern} noTransform={true}>
                                                        </ColoredButton>
                                                    );
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {row.methods && row.methods.map((method, idx) => {
                                                    return (
                                                        <ColoredButton key={idx} size={"s"} color={utils.color(method)}
                                                                       text={method}>
                                                        </ColoredButton>
                                                    );
                                                })}
                                            </TableCell>
                                            <TableCell className={"column-max-name"}>{row.class}</TableCell>
                                            <TableCell>{row.method}</TableCell>
                                            <TableCell><Raw raw={row.original}/></TableCell>
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

Mappings.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(Mappings));
