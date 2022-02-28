import React, { Component } from 'react';
import 'prismjs/components/prism-json';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

import { dispatch } from '../../../redux/store';
import loadProjects from '../../projects/list-projects/functions/loadProjects';
import { withRouter } from 'react-router';

class NewDevice extends Component {
    state = {
        name: '',
        project: '',
    }

    async componentDidMount() {
        const projects = await loadProjects();
        this.setState({ projects })
    }

    async post() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/devices/`,
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

    render() {
        return (
            <>
                <Button onClick={this.post.bind(this)}>Create</Button>
                <Form className="mt-3">
                    <Form.Label>Name:*</Form.Label>
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
                            onChange={ project => { this.setState({ project }) } }
                            options={ this.state.projects.map(project => ({
                                value: project._id,
                                label: project.name,
                            })) }
                        /> :
                        <BeatLoader/>
                    }
                </Form>
            </>
        );
    }
}
 
export default withRouter(NewDevice);