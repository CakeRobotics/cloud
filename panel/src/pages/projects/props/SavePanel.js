import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Button, Spinner } from 'react-bootstrap';
import { Check, Save } from 'react-bootstrap-icons';
import { withRouter } from 'react-router-dom';

import { dispatch } from '../../../redux/store';
import loadInfo from './functions/loadInfo';
import saveProps from './functions/saveProps';

class Panel extends Component {
    async saveProps_() {
        dispatch({
            type: 'SET_EDITOR_STATE',
            payload: 'SAVING',
        });
        try {
            await saveProps();
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
                title: "Props saved in cloud.",
                color: "SUCCESS",
                time: new Date(),
            }
        });
        const projectId = this.props.match.params.projectId;
        this.props.history.push(`/projects/${projectId}`)
    }

    render() {
        const firstTime = window.location.href.match(/firstTime/);
        const buttonContent = firstTime ? <> Continue <Check/> </> : <> Save Props <Save/> </>;
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col>
                        <Button variant="success" size="sm" onClick={this.saveProps_.bind(this)} disabled={this.props.pageState !== 'EDITING'}>
                            {buttonContent}
                        </Button>
                    </Col>
                    <Col className="d-flex">
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

export default withRouter(ReduxPanel);