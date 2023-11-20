import React, { Component } from 'react';
import Editor from 'react-simple-code-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { dispatch } from '../../redux/store';

const DEFAULT_OBJECT =
{
    name: "",
    tags: [],
    thumbnail: ""
};

class NewTemplate extends Component {
    state = {
        template: DEFAULT_OBJECT,
        json: JSON.stringify(DEFAULT_OBJECT),
        jsonValid: true,
    }

    async post() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/templates/all`,
                this.state.template,
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
            })
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

    onManualJsonChange(json) {
        try {
            const template = JSON.parse(json);
            const jsonValid = true;
            this.setState({ template, json, jsonValid });
        } catch (error) {
            const jsonValid = false;
            this.setState({ json, jsonValid });
        }
    }

    getTemplate() {
        return this.state.template;
    }

    setTemplateField(field, value) {
        var template = {...this.state.template};
        template[field] = value;
        const json = JSON.stringify(template);
        const jsonValid = true;
        this.setState({ template, json, jsonValid });
    }

    render() {
        return (
            <>
                <Button onClick={this.post.bind(this)}>Post</Button>
                <Form className="mt-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control value={this.getTemplate().name} onChange={e => this.setTemplateField('name', e.target.value)}/>
                </Form>
                <Form className="mt-3">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control value={this.getTemplate().description} as="textarea" rows="3" onChange={e => this.setTemplateField('description', e.target.value)}/>
                </Form>
                <Form className="mt-3">
                    <Form.Label>Tags: (CSV)</Form.Label>
                    <Form.Control value={this.getTemplate().tags.join(',')} onChange={e => this.setTemplateField('tags', e.target.value.split(','))}/>
                </Form>
                <Form className="mt-3">
                    <Form.Label>Thumbnail:</Form.Label>
                    <Form.Control value={this.getTemplate().thumbnail} onChange={e => this.setTemplateField('thumbnail', e.target.value)}/>
                </Form>
                <Form className="mt-3">
                    <Form.Label>URDF:</Form.Label>
                    <Form.Control value={this.getTemplate().urdf} onChange={e => this.setTemplateField('urdf', e.target.value)}/>
                </Form>

                <p className="mt-3">{this.state.jsonValid ? 'Valid JSON' : 'Bad JSON'}</p>
                <Editor
                    className="code-editor"
                    value={this.state.json}
                    onValueChange={this.onManualJsonChange.bind(this)}
                    highlight={code => highlight(code, languages.json)}
                    padding={10}
                    tabSize={4}
                />
            </>
        );
    }
}
 
export default NewTemplate;