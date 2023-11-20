import axios from 'axios';
import React, { Component } from 'react';
import { Badge, Button, Card, Container, Col, Row } from 'react-bootstrap';
import { dispatch, getState } from '../../redux/store';
import { withRouter } from "react-router-dom";

import './style.css';

class AllTemplates extends Component {
    state = {
        templates: [],
    }
    
    async componentDidMount() {
        await this.loadTemplates();
    }

    async loadTemplates() {
        const templates = (await axios.get('/api/templates/all')).data;
        this.setState({ templates });
    }

    async startWithTemplate(templateId) {
        const { username } = await getState();
        const token = localStorage.getItem('auth_token');
        try {
            const response = await axios.post(
                `/api/projects/${username}`,
                { template_id: templateId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            var projectId = response.data;
        } catch (error) {
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Error",
                    body: error.response.data,
                    color: "ERROR",
                    time: new Date(),
                }
            });
            return;
        }
        dispatch({
            type: 'ADD_TOAST',
            payload: {
                title: `Project was created with ID: ${projectId}`,
                color: "SUCCESS",
                time: new Date(),
            }
        });
        this.props.history.push(`/projects/${projectId}/props?firstTime`);
    }

    async delete(template_id) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.delete(
                `/api/templates/all/${template_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            this.setState({ templates: [] });
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Deleted.",
                    body: response.data,
                    color: "SUCCESS",
                    time: new Date(),
                }
            });
            await this.loadTemplates();
        } catch (error) {
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Can't delete.",
                    body: error.response.data,
                    color: "ERROR",
                    time: new Date(),
                }
            })
        }
    }

    render() {
        return (
            this.state.templates.map(template =>
                <Card key={template._id} className="mb-3">
                    <Card.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <Card.Title>{template.name}</Card.Title>
                                    {template.description && <Card.Text>{template.description}</Card.Text>}
                                    <div className="mb-2">
                                        {template.tags && [...new Set(template.tags) /* Avoids duplicates */].map(tag => <Badge key={tag} bg="secondary" className="me-1">{tag}</Badge>)}
                                    </div>
                                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => { this.startWithTemplate(template._id) }}>Start with this template</Button>
                                    <Button size="sm" variant="outline-danger" className="me-1" onClick={() => { this.delete(template._id) }}>Delete</Button>
                                    <Button size="sm" variant="outline-secondary" href={`${process.env.PUBLIC_URL}/templates/edit/${template._id}`}>Edit</Button>
                                </Col>
                                <Col sm="auto">
                                    {template.thumbnail && <img className="template-thumbnail" alt={template.name} src={`data:image/png;base64,${template.thumbnail}`}/>}
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            )
        );
    }
}
 
export default withRouter(AllTemplates);