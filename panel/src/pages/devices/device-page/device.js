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
    }

    async componentDidMount() {
        const {owner, name} = this.props.match.params;
        const device = await loadDevice(owner, name);
        this.setState(device);
        const projects = await loadProjects();
        this.setState({ projects })
        // Overwrite project string with project option object
        console.log(device.project)
        if (device.project && device.project !== '') {
            const projectMatch = projects.find(project => project._id === device.project);
            this.setState({ project: {value: projectMatch._id, label: projectMatch.name} }) // Overwrite
        }
    }

    async post() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.put(
                `/api/devices/${this.props.match.params.owner}/${this.props.match.params.name}`,
                { name: this.state.name, project: this.state.project.value },
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
                                value: project._id,
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
                    <p><Form.Label className="inline-code">
                        docker run --privileged -e NAME={this.state.owner}/{this.state.name} -e TOKEN={this.state.token} cakerobotics/crl-dev
                    </Form.Label></p>
                </Form>
                <Form className="mt-3" hidden={!this.state.online}>
                    <Form.Label>Control:</Form.Label>
                    <Button onClick={this.restart.bind(this)} className="ms-1" variant="outline-primary" size="sm">Restart</Button>
                </Form>
            </>
        );
    }
}
 
export default withRouter(Device);