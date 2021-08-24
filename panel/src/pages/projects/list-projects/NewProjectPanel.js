import React, { Component } from 'react';
import { CloudPlus } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap';

class Panel extends Component {
    render() { 
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col>
                        <Button size="sm">
                            New Project <CloudPlus/>
                        </Button>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
export default Panel;