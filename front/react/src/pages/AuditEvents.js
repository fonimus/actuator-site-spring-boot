import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";

import api from '../services/api';
import logger from '../services/logger';
import utils from '../services/utils';
import {openSnackbar} from "../components/Notifier";
import Card from "@material-ui/core/Card/Card";
import CardHeader from "../components/CardHeader";
import CardBody from "../components/CardBody";
import Typography from "@material-ui/core/Typography/Typography";
import ButtonFilter from "../components/ButtonFilter";
import Input from "@material-ui/core/Input/Input";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import Icon from "@material-ui/core/Icon/Icon";
import CardTable from "../components/CardTable";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import ColoredButton from "../components/ColoredButton";
import Raw from "../components/Raw";
import Grid from "@material-ui/core/Grid/Grid";

class AuditEvents extends Component {

    state = {
        source: null,
        loading: true,
        columns: [
            {id: 'timestamp', sortable: true, i18n: 'common.timestamp'},
            {id: 'principal', sortable: true, i18n: 'common.principal'},
            {id: 'type', sortable: true, i18n: 'common.type'},
            {id: 'data.message', sortable: true, i18n: 'common.message'},
            {id: 'details', sortable: false, i18n: 'common.details'},
        ],
        types: [],
        typeFilters: [],
        search: ''
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
                types: types,
                loading: false
            })
        }).catch((e) => {
            logger.error("Error while loading audits", e);
            openSnackbar(<FormattedMessage id="error.get.audit"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['principal', 'data.message']) &&
                utils.inFilter(this.state.typeFilters, value.type);
        })
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
        const {source, loading, columns, types} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/auditevents" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"audit.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <FormattedMessage id="filter.types"/>
                                        {types.map((type, idx) => {
                                            return (
                                                <ButtonFilter key={idx} text={type} color={utils.color(type)}
                                                              onSelect={() => this.handleFilter(type, true)}
                                                              onDelete={() => this.handleFilter(type, false)}/>
                                            );
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <Input id="search" type={"text"} className={"full-width"}
                                               value={this.state.search} onChange={this.handleChange}
                                               placeholder={this.searchPlaceHolder()}
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
                        {
                            source &&
                            <CardTable
                                data={source.events} columns={columns} customFilter={this.filter}
                                initialOrder={"desc"} initialOrderBy={"timestamp"}
                                row={(row, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{row.timestamp}</TableCell>
                                            <TableCell>{row.principal}</TableCell>
                                            <TableCell>
                                                <ColoredButton size={"s"} color={utils.color(row.type)}
                                                               text={row.type}/>
                                            </TableCell>
                                            <TableCell>{row.data.message}</TableCell>
                                            <TableCell><Raw raw={row}/></TableCell>
                                        </TableRow>
                                    )
                                }}/>
                        }
                    </CardBody>
                </Card>
            </div>
        )
            ;
    }
}

AuditEvents.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(AuditEvents));
