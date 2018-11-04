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
import ColoredButton from "../components/ColoredButton";
import ButtonFilter from "../components/ButtonFilter";
import {openSnackbar} from "../components/Notifier";
import Typography from "@material-ui/core/Typography/Typography";
import CardHeader from "../components/CardHeader";
import CardTable from "../components/CardTable";
import CardBody from "../components/CardBody";
import Grid from "@material-ui/core/Grid/Grid";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

class Loggers extends Component {

    state = {
        source: null,
        loading: true,
        open: false,
        columns: [
            {id: 'name', sortable: true, i18n: 'common.name'},
            {id: 'configuredLevel', sortable: true, i18n: 'loggers.configured-level'},
            {id: 'effectiveLevel', sortable: true, i18n: 'loggers.effective-level'},
            {id: 'update', sortable: false, i18n: 'loggers.update'},
        ],
        data: [],
        levels: [],
        levelFilters: [],
        search: '',
        logger: {}
    };

    componentDidMount() {
        this.refresh();
    };

    handleClose = () => {
        this.setState({open: false});
    };

    refresh() {
        this.setState({loading: true});
        api.loggers().then(response => {
            this.setState({
                source: response.data,
                data: Object.keys(response.data.loggers).map((key, index) => Object.assign({
                    id: index,
                    name: key
                }, response.data.loggers[key])),
                levels: response.data.levels
            });
        }).catch((e) => {
            logger.error("Error while loading loggers", e);
            openSnackbar(<FormattedMessage id="error.get.loggers"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    confirm = (name, level) => {
        this.setState({open: true, logger: {name, level}});
    };

    updateLevel = (name, level) => {
        this.setState({loading: true});
        api.loggerUpdate(name, level).then(() => {
            openSnackbar(<FormattedMessage id="loggers.update.success"/>, 'success');
            this.refresh();
        }).catch((e) => {
            logger.error('Error while updating logger: ' + name, e);
            openSnackbar(<FormattedMessage id="loggers.update.error"/>, 'error');
        }).finally(() => {
            this.setState({open: false, loading: false});
        });
    };

    filter = (list) => {
        return list.filter((value) => {
            return utils.search(this.state.search, value, ['name']) &&
                utils.inFilter(this.state.levelFilters, value.configuredLevel) &&
                utils.inFilter(this.state.levelFilters, value.effectiveLevel);
        })
    };

    searchPlaceHolder() {
        return this.props.intl.formatMessage({id: 'common.filter'});
    };

    handleFilter = (value, onSelect) => {
        this.setState({levelFilters: utils.buildFilter(this.state.levelFilters, value, onSelect)});
    };

    handleChange = (event) => {
        this.setState({
            search: event.target.value,
        });
    };

    render() {
        const {source, data, loading, columns, levels, open, logger} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/loggers" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"loggers.title"}/>}/>
                    <CardBody loading={loading}>
                        <div className={"filters"}>
                            <Typography component={"span"}>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <FormattedMessage id="filter.levels"/>
                                        {levels.map((level, idx) => {
                                            return (
                                                <ButtonFilter
                                                    key={idx} text={level} color={utils.color(level)}
                                                    onSelect={() => this.handleFilter(level, true)}
                                                    onDelete={() => this.handleFilter(level, false)}
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
                                                           color={utils.color(row.effectiveLevel)}
                                                           text={row.effectiveLevel}>
                                            </ColoredButton>
                                        </TableCell>
                                        <TableCell>
                                            {row.configuredLevel &&
                                            <ColoredButton size={"s"} color={utils.color(row.configuredLevel)}
                                                           text={row.configuredLevel}>
                                            </ColoredButton>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {levels.map((level, idx) => {
                                                return (
                                                    <ColoredButton onClick={() => this.confirm(row.name, level)}
                                                                   size={"xs"} key={idx} color={utils.color(level)}
                                                                   text={level}>
                                                    </ColoredButton>
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                )
                            }}/>
                        }
                    </CardBody>
                </Card>

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        <FormattedMessage id="common.confirmation"/>
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            <FormattedHTMLMessage id="loggers.update.confirm-message"
                                                  values={{name: logger.name, level: logger.level}}/>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} autoFocus>
                            <FormattedMessage id="common.cancel"/>
                        </Button>
                        <Button onClick={() => this.updateLevel(logger.name, logger.level)} autoFocus>
                            <FormattedMessage id="common.confirm"/>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Loggers.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(withStyles({...utils.defaultCardContentStyle})(Loggers));
