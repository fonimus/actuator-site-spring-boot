import React, {Component} from 'react';
import PropTypes from "prop-types";
import {createMuiTheme, MuiThemeProvider, withStyles, withTheme} from "@material-ui/core";
import Chip from "@material-ui/core/Chip/Chip";

const styles = {
    button: {
        height: '28px',
        minHeight: '28px',
        marginRight: '10px',
        margin: '6px 8px',
        minWidth: '88px'
    },
    icon: {
        fontSize: 'initial',
        color: 'white'
    }
};

class ButtonFilter extends Component {
    state = {
        onDelete: null
    };

    handleFilter = () => {
        if (this.state.onDelete) {
            this.setState({onDelete: null});
            this.props.onDelete();
        } else {
            this.setState({onDelete: () => this.handleFilter()});
            this.props.onSelect();
        }
    };

    render() {
        const {classes, color, text, theme} = this.props;
        const {onDelete} = this.state;

        let newTheme;
        if (!color || color === 'primary') {
            newTheme = theme;
        } else {
            newTheme = createMuiTheme({
                palette: {
                    primary: {
                        main: color
                    }
                },
                typography: {
                    useNextVariants: true,
                }
            });
        }

        return (
            <MuiThemeProvider theme={newTheme}>
                <Chip className={classes.button} color={"primary"} label={text} variant={onDelete ? null : "outlined"}
                      onClick={this.handleFilter} onDelete={onDelete}
                      classes={{deleteIcon: classes.icon}} style={onDelete ? {color: 'white'} : {}}/>
            </MuiThemeProvider>
        );
    }
}

ButtonFilter.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.string,
    text: PropTypes.any,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default withTheme()(withStyles(styles)(ButtonFilter));
