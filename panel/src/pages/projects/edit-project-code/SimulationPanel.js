import React, { Component } from 'react';
import { Play } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap'; 
import Select from 'react-select';

class Panel extends Component {
    render() { 
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col sm={6}>
                        <Button size="sm">
                            Simulate <Play/>
                        </Button>
                    </Col>
                    <Col>
                        <Container className="p-0">
                            <Row className="action-info-text">Last Run: 40 mins ago</Row>
                            <Row className="action-info-sub-text">No new changes</Row>
                        </Container>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>Simulation World:</Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            options={[
                                { value: 'chocolate', label: 'My Sim World' },
                            ]}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
export default Panel;