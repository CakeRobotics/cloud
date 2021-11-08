import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Button, Spinner, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { withRouter } from 'react-router-dom';

import { dispatch } from '../../../redux/store';
import deleteProject from './functions/deleteProject';

class Panel extends Component {
    state = {
        showModal: false,
    }

    async deleteProject_() {
        dispatch({
            type: 'SET_EDITOR_STATE',
            payload: 'SAVING',
        });
        try {
            await deleteProject();
        } catch (error) {
            dispatch({
                type: 'SET_EDITOR_STATE',
                payload: 'EDITING',
            });
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Failed to delete project.",
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
        dispatch({
            type: 'ADD_TOAST',
            payload: {
                title: "Project deleted.",
                color: "SUCCESS",
                time: new Date(),
            }
        });
        this.props.history.push('/projects')
    }

    showModal() {
        this.setState({ showModal: true });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <>
                <Container className="sidebar-panel">
                    <Row>
                        <Col>
                            <Button variant="outline-danger" size="sm" onClick={this.showModal.bind(this)} disabled={this.props.pageState !== 'EDITING'}>
                                Delete project <Trash/>
                            </Button>
                        </Col>
                        <Col className="d-flex">
                            <Spinner hidden={this.props.pageState !== 'SAVING'} animation="border" size="sm" className="m-auto"/>
                        </Col>
                    </Row>
                </Container>
                <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure? This action cannot be undone!</p>
                        <Button variant="secondary" onClick={this.hideModal.bind(this)}>No</Button>
                        <Button className="ms-1" variant="danger" onClick={this.deleteProject_.bind(this)}>Yes</Button>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        pageState: state.projects.current.state,
        info: state.projects.current.info,
        dirty: state.projects.current.dirty,
        username: state.username,
    }
}

const ReduxPanel = connect(mapStateToProps)(Panel);

export default withRouter(ReduxPanel);