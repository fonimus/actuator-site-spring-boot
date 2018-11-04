import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import CardHeader from "../components/CardHeader";
import api from "../services/api";
import logger from "../services/logger";
import {openSnackbar} from "../components/Notifier";
import Alert from "../components/Alert";

const styles = {};

class Metrics extends Component {

    state = {
        source: null,
        loading: true
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.metrics().then(response => {
            this.setState({
                source: response.data
            });
        }).catch((e) => {
            logger.error("Error while loading metrics", e);
            openSnackbar(<FormattedMessage id="error.get.metrics"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    render() {
        const {source} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/metrics" refresh={() => this.refresh()}
                                title={<FormattedMessage id={"metrics.title"}/>}/>
                    <CardContent>
                        <Alert type={"warning"}>
                            Coming soon...
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Metrics.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Metrics);
