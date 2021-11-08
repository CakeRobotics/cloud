import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';

import List from './List';
import NewProjectPanel from './NewProjectPanel';
import loadProjects from './functions/loadProjects';
import createProject from './functions/createProject';
import { dispatch } from '../../../redux/store';

class Page extends Component {
    state = {
        projects: [],
    }
    async componentDidMount() {
        const projects = await loadProjects();
        this.setState({ projects });
    }
    async createProject_(projectName) {
        try {
            await createProject(projectName);
        } catch (error) {
            var error_msg = `Error: ${error.response.data}`;
            if (error.response.status === 409) {
                error_msg = 'Error: Project name is a duplicate.';
            }
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: error_msg,
                    color: 'ERROR',
                }
            })
            return;
        }
        dispatch({
            type: 'ADD_TOAST',
            payload: {
                title: 'Project created',
                color: 'SUCCESS',
            }
        });
        const projects = await loadProjects();
        this.setState({ projects });
    }
    render() { 
        return (
            <>
                <Container className="mt-4">
                    <Breadcrumb>
                        <Breadcrumb.Item active>My Projects</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <Container>
                    <Row>
                        <Col sm="12" md="4" lg="3">
                            {/* Sidebar */}
                            <NewProjectPanel createProject={this.createProject_.bind(this)}/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <List projects={this.state.projects}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default Page;