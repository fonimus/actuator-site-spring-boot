import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import CardHeader from "../components/CardHeader";
import api from "../services/api";
import logger from "../services/logger";
import {openSnackbar} from "../components/Notifier";
import CardBody from "../components/CardBody";
import Highlight from "react-highlight.js";

const styles = {};

class Info extends Component {

    state = {
        source: null,
        code: null,
        loading: true
    };

    componentDidMount() {
        this.refresh();
    };

    refresh() {
        this.setState({loading: true});
        api.info().then(response => {
            this.setState({
                source: response.data,
                code: JSON.stringify(response.data, null, 2)
            })
        }).catch((e) => {
            logger.error("Error while loading info", e);
            openSnackbar(<FormattedMessage id="error.get.info"/>, 'error');
        }).finally(() => {
            this.setState({loading: false});
        })
    };

    render() {
        const {source, code, loading} = this.state;

        return (
            <div>
                <Card>
                    <CardHeader source={source} url="/info" refresh={() => this.refresh()}
                                title={<FormattedMessage id="info.title"/>}/>
                    <CardBody loading={loading}>
                        {source &&
                        <Highlight language={"json"}>
                            {code}
                        </Highlight>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}

Info.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Info);
