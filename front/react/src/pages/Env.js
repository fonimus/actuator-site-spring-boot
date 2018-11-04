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
import ColoredButton from "../components/ColoredButton";
import ButtonFilter from "../components/ButtonFilter";
import {openSnackbar} from "../components/Notifier";
import Typography from "@material-ui/core/Typography/Typography";
import CardHeader from "../components/CardHeader";
import CardTable from "../components/CardTable";
import CardBody from "../components/CardBody";
import Alert from "../components/Alert";

function parse(from, properties) {
    return Object.keys(properties).map((key) => ({
        name: key,
        value: properties[key].value,
        source: from,
        origin: properties[key].origin
    }));
}

class Env extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'name', sortable: true, i18n: 'env.property-name'},
            {id: 'value', sortable: true, i18n: 'env.property-value'},
            {id: 'source', sortable: false, i18n: 'env.property-source'},
            {id: 'origin', sortable: false, i18n: 'env.property-origin'}
        ],
        data: [],
        profiles: [],
        sources: [],
        sourceFilters: [],
        search: ''
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.env().then(response => {
            let sources = [];
            let data = [];
            for (const propertySource of response.data.propertySources) {
                sources.push(propertySource.name);
                data = data.concat(parse(propertySource.name, propertySource.properties));
            }
            this.setState({
                source: response.data, data, sources,
                profiles: response.data.activeProfiles,
            });
        }).catch((e) => {
            logger.error("Error while loading env", e);
            openSnackbar(<FormattedMessage id="error.get.env"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({sourceFilters: utils.buildFilter(this.state.sourceFilters, value, onSelect)});
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name', 'value', 'origin']) &&
                utils.inFilter(this.state.sourceFilters, value.source);
        })
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, loading, columns, profiles, sources, search, data} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/env" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"env.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Alert type={"info"}>
                                <Typography component={"span"}>
                                    {profiles.length === 0 && <FormattedMessage id="env.no-profiles"/>}
                                    {profiles.length > 0 &&
                                    <span><FormattedMessage id="env.profiles"/> : </span>
                                    }
                                    {profiles.length > 0 &&
                                    profiles.map((profile, idx) => {
                                        return (
                                            <span className={"space"} key={idx}>{profile}</span>
                                        );
                                    })
                                    }
                                </Typography>
                            </Alert>
                            <Typography component={"span"}>
                                <FormattedMessage id="filter.sources"/>
                                {sources.map((source, idx) => {
                                    return (
                                        <ButtonFilter key={idx} text={source} color={utils.color(source)}
                                                      onSelect={() => this.handleFilter(source, true)}
                                                      onDelete={() => this.handleFilter(source, false)}/>
                                    );
                                })}
                                <Input id="search" type={"text"} className={"full-width"}
                                       value={search} placeholder={this.searchPlaceHolder()}
                                       onChange={this.handleChange}
                                       endAdornment={
                                           <InputAdornment position="end">
                                               <Icon>search</Icon>
                                           </InputAdornment>
                                       }
                                />
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
                                        <TableCell className={"column-max-name"}>{row.value}</TableCell>
                                        <TableCell>
                                            <ColoredButton size={"s"} noTransform={true}
                                                           color={utils.color(row.source)}
                                                           text={row.source}>
                                            </ColoredButton>
                                        </TableCell>
                                        <TableCell>{row.origin}</TableCell>
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

Env.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default  injectIntl(withStyles({...utils.defaultCardContentStyle})(Env));
