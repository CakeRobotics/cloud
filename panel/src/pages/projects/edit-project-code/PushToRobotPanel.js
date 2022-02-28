import React, { Component } from 'react';
import { ArrowBarRight } from 'react-bootstrap-icons';
import { Container, Col, Row, Button } from 'react-bootstrap'; 
import Select from 'react-select';
import { withRouter } from 'react-router';
import axios from 'axios';

import { dispatch } from '../../../redux/store';
import loadDevices from './functions/loadDevices';
import './PushToRobotPanel.css';


class Panel extends Component {
    state = {};
    async componentDidMount() {
        const devices = await loadDevices();
        const { projectId } = this.props.match.params;
        var selectedDevices = devices.filter(device => projectId === device.project);
        selectedDevices = selectedDevices.map(device => ({
            value: {owner: device.owner, name: device.name},
            label: <>{device.online ? <div className="inlist-circle inlist-circle-green"></div> : <div className="inlist-circle inlist-circle-gray"></div>} {device.name}</>,
        }));
        this.setState({ devices, selectedDevices });
    }

    async updateAssignedDevices(selectedDevices) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/devices/assign_project`,
                { devices: selectedDevices.map(selection => selection.value), unsetOthers: true, project: this.props.match.params.projectId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Success.",
                    body: response.body,
                    color: "SUCCESS",
                    time: new Date(),
                }
            });
        } catch (error) {
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Error.",
                    body: error.response.data,
                    color: "ERROR",
                    time: new Date(),
                }
            })
        }
    }

    async restartAssignedDevices() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/devices/restart`,
                { devices: this.state.selectedDevices.map(selection => selection.value), unsetOthers: true, project: this.props.match.params.projectId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Success.",
                    body: response.body,
                    color: "SUCCESS",
                    time: new Date(),
                }
            });
        } catch (error) {
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Error.",
                    body: error.response.data,
                    color: "ERROR",
                    time: new Date(),
                }
            })
        }
    }

    render() {
        return (
            <Container className="sidebar-panel">
                <Row>
                    <Col sm={6}>
                        <Button size="sm" onClick={this.restartAssignedDevices.bind(this)}>
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
                            options={this.state.devices && this.state.devices.map(device => ({
                                label: <>{device.online ? <div className="inlist-circle inlist-circle-green"></div> : <div className="inlist-circle inlist-circle-gray"></div>} {device.name}</>,
                                value: {owner: device.owner, name: device.name},
                            }))}
                            value={this.state.selectedDevices}
                            onChange={selectedDevices => { this.setState({ selectedDevices }); this.updateAssignedDevices(selectedDevices); }}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
export default withRouter(Panel);