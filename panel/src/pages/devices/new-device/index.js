import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';

import NewDeviceForm from './new';
import BackPanel from '../BackPanel';
import createDevice from './functions/createDevice';
import { dispatch } from '../../../redux/store';

class Page extends Component {
    state = {
        devices: [],
    }
    async createDevice_(deviceName) {
        try {
            await createDevice(deviceName);
        } catch (error) {
            var error_msg = `Error: ${error.response.data}`;
            if (error.response.status === 409) {
                error_msg = 'Error: Device name is a duplicate.';
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
                title: 'Device created',
                color: 'SUCCESS',
            }
        });
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
                            <BackPanel createDevice={this.createDevice_.bind(this)}/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <NewDeviceForm devices={this.state.devices}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default Page;