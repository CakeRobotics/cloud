import './index.css';
import '../../../common/Sidebar.css';

import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import Editor from './Editor';
import SavePanel from './SavePanel';
import loadProps from './functions/loadProps';
import loadInfo from './functions/loadInfo';
import { dispatch, getState } from '../../../redux/store';
import DeletePanel from './DeletePanel';

const closeConfirmation = async function(event) {
    const state = await getState();
    const editorDirty = state.projects.current.dirty;
    if (editorDirty) {
        event.preventDefault();
        return event.returnValue = "Props is not saved. Are you sure?";
    }
}

class Page extends Component {
    async componentDidMount() {
        window.addEventListener("beforeunload", closeConfirmation);
        await dispatch({
            type: 'SET_PROJECT_NAME',
            payload: this.props.match.params.projectId,
        })
        await loadProps();
        await loadInfo();
    }

    render() { 
        return (
            <>
                <Container className="mt-4">
                    <Breadcrumb>
                        <Breadcrumb.Item href={`${process.env.PUBLIC_URL}/projects`}>My Projects</Breadcrumb.Item>
                        <Breadcrumb.Item active>{this.props.projectName}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <Container>
                    <Row>
                        <Col sm="12" md="4" lg="3">
                            {/* Sidebar */}
                            <SavePanel/>
                            <DeletePanel/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <Editor/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

const mapStateToProps = function(state) {
    var projectName = '';
    if (state.projects.current.info) {
        projectName = state.projects.current.info.name;
    }
    return {
        projectName,
    }
}

const ReduxPage = connect(mapStateToProps)(Page)

export default withRouter(ReduxPage);