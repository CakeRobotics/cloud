import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Button, Spinner } from 'react-bootstrap';
import { Save } from 'react-bootstrap-icons';
import { formatDistanceToNow } from 'date-fns';

import { dispatch } from '../../../redux/store';
import loadInfo from './functions/loadInfo';
import saveCode from './functions/saveCode';

class Panel extends Component {
    componentDidMount() {
        this.automaticUpdate();
    }

    // This function is used to update "last saved x mins ago"
    automaticUpdate() {
        this.forceUpdate();
        var timeout = 5000;
        if (this.props.info && (this.props.info.lastChange - new Date()) > 60000 ) {
            timeout = 60000;
        }
        setTimeout(this.automaticUpdate.bind(this), timeout);
    }

    async saveCode_() {
        dispatch({
            type: 'SET_EDITOR_STATE',
            payload: 'SAVING',
        });
        try {
            await saveCode();
        } catch (error) {
            dispatch({
                type: 'SET_EDITOR_STATE',
                payload: 'EDITING',
            });
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Saving failed.",
                    body: error.response.data,
                    color: "ERROR",
                    time: new Date(),
                }
            })
            return;
        }
        dispatch({
            type: 'SET_EDITOR_DIRTY',
            payload: false,
        });
        dispatch({
            type: 'SET_EDITOR_STATE',
            payload: 'EDITING',
        });
        await loadInfo();
        dispatch({
            type: 'ADD_TOAST',
            payload: {
                title: "Code saved in cloud.",
                color: "SUCCESS",
                time: new Date(),
            }
        })
    }

    render() {
        const lastSaveDistance = this.props.info != null ? formatDistanceToNow(new Date(this.props.info.lastChange), {includeSeconds: true}) : "??";
        const newChangesString = this.props.dirty ? "There are new changes" : "No new changes";
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col>
                        <Button size="sm" onClick={this.saveCode_.bind(this)} disabled={this.props.pageState !== 'EDITING'}>
                            Save Code <Save/>
                        </Button>
                    </Col>
                    <Col className="d-flex">
                        <Container className="p-0" hidden={this.props.pageState === 'SAVING'}>
                            <Row className="action-info-text">Last Save: {lastSaveDistance} ago</Row>
                            <Row className="action-info-sub-text">{newChangesString}</Row>
                        </Container>
                        <Spinner hidden={this.props.pageState !== 'SAVING'} animation="border" size="sm" className="m-auto"/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        pageState: state.projects.current.state,
        info: state.projects.current.info,
        dirty: state.projects.current.dirty,
    }
}

const ReduxPanel = connect(mapStateToProps)(Panel);

export default ReduxPanel;