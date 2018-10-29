import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {createMuiTheme, MuiThemeProvider, withStyles, withTheme} from "@material-ui/core";

const base = {
    padding: '0 16px'
};

const styles = {
    smallHomeButton: {
        ...base,
        margin: 0,
        height: '28px',
        minHeight: '28px'
    },
    homeButton: {
        ...base,
        margin: '6px 8px',
        height: '36px',
        minHeight: '36px'
    }
};

class ColoredButton extends Component {
    render() {
        const {classes, color, text, theme, small} = this.props;

        let newTheme;
        if (color === 'primary') {
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
                <Button color="primary" variant="extendedFab" size="small"
                        className={small ? classes.smallHomeButton : classes.homeButton}>
                    <span style={{color: 'white'}}>{text}</span>
                </Button>
            </MuiThemeProvider>
        );
    }
}

ColoredButton.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    small: PropTypes.bool
};

export default withTheme()(withStyles(styles)(ColoredButton));
