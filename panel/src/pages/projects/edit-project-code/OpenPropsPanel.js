import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import { withRouter } from 'react-router-dom';


class Panel extends Component {
    render() {
        const projectId = this.props.match.params.projectId;
        return (
            <Container className="sidebar-panel">
                <Button size="sm" href={`${process.env.PUBLIC_URL}/projects/${projectId}/props`}>
                    Properties <Gear/>
                </Button>
            </Container>
        );
    }
}

export default withRouter(Panel);