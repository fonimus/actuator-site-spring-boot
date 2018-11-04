import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import CardContent from "@material-ui/core/CardContent/CardContent";

const styles = {
    customCardContent: {
        padding: '16px'
    }
};

class CardBody extends Component {

    render() {
        const {classes, loading, children} = this.props;

        return (
            <CardContent className={classes.customCardContent}>
                {loading ?
                    <Typography component={"span"} align={"center"}>
                        <CircularProgress color={"primary"} size={100} thickness={3}/>
                    </Typography> :
                    children
                }
            </CardContent>
        );
    }
}

CardBody.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default withTheme()(withStyles(styles)(CardBody));
