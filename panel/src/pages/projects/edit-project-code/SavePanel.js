import React, { Component } from 'react';
import { Save } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap';

class Panel extends Component {
    render() { 
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col>
                        <Button size="sm">
                            Save Code <Save/>
                        </Button>
                    </Col>
                    <Col>
                        <Container className="p-0">
                            <Row className="action-info-text">Last Save: 5 mins ago</Row>
                            <Row className="action-info-sub-text">No new changes</Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
export default Panel;