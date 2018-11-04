import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel/TableSortLabel";
import TableBody from "@material-ui/core/TableBody/TableBody";
import utils from "../services/utils";
import Typography from "@material-ui/core/Typography/Typography";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";

const styles = {};

class CardTable extends Component {

    state = {
        page: 0,
        rowsPerPage: 10,
        order: 'asc',
        orderBy: null
    };

    componentWillMount() {
        let order = this.state.order;
        let orderBy = this.state.orderBy;
        if (this.props.initialOrder) {
            order = this.props.initialOrder;
        }
        if (this.props.initialOrderBy) {
            orderBy = this.props.initialOrderBy;
        }
        this.setState({order, orderBy});
    };

    handleSort = (column) => {
        const orderBy = column;
        let order = 'desc';

        if (this.state.orderBy === column && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    filter = (data) => {
        if (this.props.customFilter) {
            return this.props.customFilter(data);
        }
        return data;
    };

    render() {
        const {page, rowsPerPage, order, orderBy} = this.state;
        const {classes, columns, data} = this.props;
        const filteredRows = utils.stableSort(this.filter(data), utils.getSorting(order, orderBy));
        const rows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (

            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, idx) => {
                                return (
                                    <TableCell key={idx} sortDirection={orderBy === column.id ? order : false}>
                                        {column.sortable ?
                                            <TableSortLabel active={orderBy === column.id} direction={order}
                                                            onClick={() => column.sortable && this.handleSort(column.id)}>
                                                <FormattedMessage id={column.i18n}/>
                                            </TableSortLabel> : <FormattedMessage id={column.i18n}/>
                                        }
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(this.props.row)}
                        {filteredRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <Typography align="center">
                                        <FormattedMessage id="common.no-results"/>
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

CardTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    customFilter: PropTypes.func,
    initialOrderBy: PropTypes.string,
    initialOrder: PropTypes.string,
    row: PropTypes.func
};

export default withTheme()(withStyles(styles)(CardTable));
