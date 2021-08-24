import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import List from './List';
import NewProjectPanel from './NewProjectPanel';

class Page extends Component {
    render() { 
        return (
            <>
                <Container className="mt-4">
                    <h2>My Projects</h2>
                    <Row>
                        <Col sm="12" md="4" lg="3" className="mt-4">
                            {/* Sidebar */}
                            <NewProjectPanel/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <List/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default Page;