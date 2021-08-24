import React, { Component } from 'react';
import { ArrowBarRight } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap'; 
import Select from 'react-select';

class Panel extends Component {
    render() { 
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col sm={6}>
                        <Button size="sm">
                            Send to Robot <ArrowBarRight/>
                        </Button>
                    </Col>
                    <Col>
                        <Container className="p-0">
                            <Row className="action-info-text">Last Push: 2 days ago</Row>
                            <Row className="action-info-sub-text">No new changes</Row>
                        </Container>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>Target Robots:</Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            isMulti
                            options={[
                                { value: 'chocolate', label: 'MyBot-1' },
                                { value: 'strawberry', label: 'MyBot-2' },
                                { value: 'vanilla', label: 'MyBot-3' }
                            ]}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
export default Panel;