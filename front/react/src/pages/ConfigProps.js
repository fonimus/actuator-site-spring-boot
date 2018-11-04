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
import {openSnackbar} from "../components/Notifier";
import Typography from "@material-ui/core/Typography/Typography";
import CardHeader from "../components/CardHeader";
import CardTable from "../components/CardTable";
import CardBody from "../components/CardBody";
import Grid from "@material-ui/core/Grid/Grid";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";

class ConfigProps extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'name', sortable: true, i18n: 'configprops.name'},
            {id: 'prefix', sortable: true, i18n: 'configprops.prefix'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        search: '',
        tableDataList: {},
        tab: 0
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.configprops().then(response => {
            let tableDataList = [];
            for (const contextName in response.data.contexts) {
                if (response.data.contexts.hasOwnProperty(contextName)) {
                    tableDataList[contextName] = {
                        name: contextName,
                        parent: response.data.contexts[contextName].parentId,
                        data: []
                    };
                    for (const beanName in response.data.contexts[contextName].beans) {
                        if (response.data.contexts[contextName].beans.hasOwnProperty(beanName)) {
                            const bean = {
                                name: beanName
                            };
                            Object.assign(bean, response.data.contexts[contextName].beans[beanName]);
                            tableDataList[contextName].data.push(bean);
                        }
                    }
                }
            }
            this.setState({source: response.data, tableDataList});
        }).catch((e) => {
            logger.error("Error while loading configuration properties", e);
            openSnackbar(<FormattedMessage id="error.get.configprops"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name', 'prefix']);
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    handleTabChange = (event, value) => {
        this.setState({tab: value});
    };


    render() {
        const {source, loading, columns, search, tableDataList, tab} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/configprops" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"configprops.title"}/>}/>
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
                            <div className={"filters"} style={{marginTop: '20px'}}>
                                <Typography component={"span"}>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
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
                                            <TableCell className={"column-max-name"}>{row.name}</TableCell>
                                            <TableCell>
                                                <ColoredButton size={"s"} color={utils.color('success')}
                                                               text={row.prefix} noTransform={true}>
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

ConfigProps.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(ConfigProps));
