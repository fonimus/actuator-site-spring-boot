import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import {FormattedMessage} from "react-intl";

const styles = {};

class NotFound extends Component {

    render() {
        return (
            <div>
                <Card>
                    <CardActions>
                        <Button variant="text">
                            Not Found
                        </Button>
                    </CardActions>
                    <CardContent>
                        <Typography align="center">
                            <FormattedMessage id="not-found.content"/>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

NotFound.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);
