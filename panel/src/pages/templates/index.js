import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';
import AllTemplates from './all';
import EditTemplate from './edit';
import NewTemplate from './new';
import TemplatesBreadcrumb from './breadcrumb';
import Nav from './nav';

class TemplatesPage extends Component {
    render() {
        return (
            <>
                <Container className="mt-4">
                    <TemplatesBreadcrumb/>
                </Container>
                <Container>
                    <Row>
                        <Col sm="12" md="4" lg="3">
                            {/* Sidebar */}
                            <Nav/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <Switch>
                                <Route path="/templates/all">
                                    <AllTemplates/>
                                </Route>
                                <Route path="/templates/new">
                                    <NewTemplate/>
                                </Route>
                                <Route path="/templates/edit/:templateId">
                                    <EditTemplate/>
                                </Route>
                                <Route path="/templates">
                                    <Redirect to="/templates/all"/>
                                </Route>
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default TemplatesPage;