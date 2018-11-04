import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {createMuiTheme, MuiThemeProvider, withStyles, withTheme} from "@material-ui/core";

const base = {
    padding: '0 16px'
};

const styles = {
    xsButton: {
        padding: '0 8px',
        margin: 0,
        marginRight: '5px',
        height: '22px',
        minHeight: '22px',
        fontSize: 'smaller',
        minWidth: 'unset'
    },
    sButton: {
        ...base,
        margin: 0,
        height: '28px',
        minHeight: '28px'
    },
    button: {
        ...base,
        margin: '6px 8px',
        height: '36px',
        minHeight: '36px'
    }
};

class ColoredButton extends Component {
    render() {
        const {classes, color, text, noTransform, theme, children, variant, size, onClick} = this.props;

        let className;
        className = classes.button;
        if (size === 'xs') {
            className = classes.xsButton;
        } else if (size === 's') {
            className = classes.sButton;
        }

        let newTheme;
        if (!color || color === 'primary') {
            newTheme = theme;
        } else {
            newTheme = createMuiTheme({
                palette: {
                    primary: {
                        main: color,
                    },
                    type: theme.palette.type
                },
                overrides: {
                    MuiButton: {
                        raisedPrimary: {
                            color: 'white',
                        },
                    },
                },
                typography: {
                    useNextVariants: true,
                }
            });
        }

        return (
            <MuiThemeProvider theme={newTheme}>
                <Button color="primary" variant={variant ? variant : 'extendedFab'}
                        size={size !== 'm' ? 'small' : null} className={className}
                onClick={onClick} style={noTransform ? {textTransform: 'unset'} : {}}>
                    {text ? <span>{text}</span> : children}
                </Button>
            </MuiThemeProvider>
        );
    }
}

ColoredButton.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.string,
    text: PropTypes.any,
    size: PropTypes.string,
    variant: PropTypes.string,
    onClick: PropTypes.func,
    noTransform: PropTypes.bool
};

export default withTheme()(withStyles(styles)(ColoredButton));
