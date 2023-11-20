import React, { Component } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Panel extends Component {
    render() { 
        return (
            <>
                <Container className="sidebar-panel">
                    <Row>
                        <Col>
                            <Button size="sm" onClick={() => {this.props.history.push('/devices')}}>
                                Back to list <ArrowLeft/>
                            </Button>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default withRouter(Panel);