import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';

import List from './List';
import NewDevicePanel from './NewDevicePanel';
import loadDevices from './functions/loadDevices';

class Page extends Component {
    state = {
        devices: [],
    }
    async componentDidMount() {
        const devices = await loadDevices();
        this.setState({ devices });
    }
    render() { 
        return (
            <>
                <Container className="mt-4">
                    <Breadcrumb>
                        <Breadcrumb.Item active>My Devices</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <Container>
                    <Row>
                        <Col sm="12" md="4" lg="3">
                            {/* Sidebar */}
                            <NewDevicePanel/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <List devices={this.state.devices}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default Page;