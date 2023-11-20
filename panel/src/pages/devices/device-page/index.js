import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';

import BackPanel from '../BackPanel';
import Device from './device';

class Page extends Component {
    state = { }
    // async createDevice_(deviceName) {
    //     try {
    //         await createDevice(deviceName);
    //     } catch (error) {
    //         var error_msg = `Error: ${error.response.data}`;
    //         if (error.response.status === 409) {
    //             error_msg = 'Error: Device name is a duplicate.';
    //         }
    //         dispatch({
    //             type: 'ADD_TOAST',
    //             payload: {
    //                 title: error_msg,
    //                 color: 'ERROR',
    //             }
    //         })
    //         return;
    //     }
    //     dispatch({
    //         type: 'ADD_TOAST',
    //         payload: {
    //             title: 'Device created',
    //             color: 'SUCCESS',
    //         }
    //     });
    // }
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
                            <BackPanel/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <Device/>
                            {/* <NewDeviceForm devices={this.state.devices}/> */}
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default Page;