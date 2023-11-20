import React, { Component } from 'react';
import 'prismjs/components/prism-json';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { withRouter } from 'react-router';

import { dispatch } from '../../../redux/store';
import loadDevice from './functions/loadDevice';
import loadProjects from '../../projects/list-projects/functions/loadProjects';
import './device.css';

class Device extends Component {
    state = {
        name: '',
        owner: '',
        project: '',
        logs: [],
    }

    loadDeviceInfo = async () => {
        const {owner, name} = this.props.match.params;
        var device = await loadDevice(owner, name);
        this.setState(device);
        const projects = await loadProjects();
        this.setState({ projects })
        // Overwrite project string with project option object
        if (device.project && device.project !== '') {
            const projectMatch = projects.find(project => device.project === `${project.owner}/${project._id}`);
            if (projectMatch) {
                this.setState({ project: {value: projectMatch, label: projectMatch.name} }) // Overwrite
            } else {
                this.setState({ project: null })
            }
        }
    }

    trackDeviceState = async () => {
        const {owner, name} = this.props.match.params;
        var device = await loadDevice(owner, name);
        this.setState({
            logs: device.logs,
            online: device.online,
            ip: device.ip,
        })
        setTimeout(this.trackDeviceState, 3000);
    }

    async componentDidMount() {
        await this.loadDeviceInfo();
        this.trackDeviceState();
    }

    async post() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.put(
                `/api/devices/${this.props.match.params.owner}/${this.props.match.params.name}`,
                { name: this.state.name, project: `${this.state.project.value.owner}/${this.state.project.value._id}` },
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
            this.props.history.push(`/devices/${this.state.owner}/${this.state.name}`);
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

    async delete() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.delete(
                `/api/devices/${this.props.match.params.owner}/${this.props.match.params.name}`,
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
            this.props.history.push('/devices')
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

    async restart() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/devices/restart`,
                { devices: [{ owner: this.props.match.params.owner, name: this.props.match.params.name }] },
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

    async stop() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/devices/stop`,
                { devices: [{ owner: this.props.match.params.owner, name: this.props.match.params.name }] },
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
            <>
                <Button onClick={this.post.bind(this)}>Update</Button>
                <Button onClick={this.delete.bind(this)} className="ms-1" variant="outline-danger">Delete</Button>
                <Form className="mt-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
                </Form>
                <Form className="mt-3">
                    <Form.Label>Target Project:</Form.Label>
                    {
                        this.state.projects ?
                        <Select
                            className="flex-grow-1"
                            placeholder="Select world..."
                            value={ this.state.project }
                            onChange={ project => { this.setState({ project }); console.log(project) } }
                            options={ this.state.projects.map(project => ({
                                value: project,
                                label: project.name,
                            })) }
                        /> :
                        <BeatLoader/>
                    }
                </Form>
                <Form className="mt-3">
                    <Form.Label>Status: {this.state.online ?
                        <><div className="inline-circle inline-circle-green"></div> Online ({this.state.ip}) </>:
                        <><div className="inline-circle inline-circle-gray"></div> Offline </>
                    }</Form.Label>
                </Form>
                <Form className="mt-3" hidden={this.state.online}>
                    <Form.Label>Startup command:</Form.Label>
                    <div><Form.Label className="inline-code">
                        <div className="dollar-sign">$ </div>sudo docker run --privileged --network=host --restart=unless-stopped -e TOKEN={this.state.token} cakerobotics/crl-dev
                    </Form.Label></div>
                </Form>
                <Form className="mt-3" hidden={!this.state.online}>
                    <Form.Label>Control:</Form.Label>
                    <Button onClick={this.restart.bind(this)} className="ms-1" variant="outline-primary" size="sm">Restart</Button>
                    <Button onClick={this.stop.bind(this)} className="ms-1" variant="outline-warning" size="sm">Stop</Button>
                </Form>
                <Form className="mt-3">
                    <Form.Label>Logs:</Form.Label>
                    <div><Form.Label className="inline-code">
                        {this.state.logs && this.state.logs.map(log => <div>{log.message}</div>)}
                    </Form.Label></div>
                </Form>
            </>
        );
    }
}
 
export default withRouter(Device);
