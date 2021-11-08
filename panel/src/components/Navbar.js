import logo from '../img/logo.svg';
import './Navbar.css';

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

const PUBLIC_URL = process.env.PUBLIC_URL || "";

class PanelNavbar extends Component {
    render() {
        const currentPath = this.props.location.pathname; // e.g. "/projects"
        const currentPage = currentPath.split('/')[1];
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href={`${PUBLIC_URL}/`}>
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' Cake Robotics'}
                    </Navbar.Brand>
                    <Nav className="flex-grow-1 ms-3"
                        activeKey={currentPage}
                        onSelect={(selectedKey) => console.log(`Nav ${selectedKey}`)}
                        >
                        <Nav.Item>
                            <Nav.Link eventKey="projects" href={`${PUBLIC_URL}/projects`}>Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="templates" href={`${PUBLIC_URL}/templates`}>Templates</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="devices" href={`${PUBLIC_URL}/devices`}>Devices</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="simulations" href={`${PUBLIC_URL}/simulations`}>Simulations</Nav.Link>
                        </Nav.Item>
                        <div className="navbar-vline"/>
                        <Nav.Item>
                            <Nav.Link eventKey="tutorials" href={`${PUBLIC_URL}/docs/tutorials`}>Tutorials</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="docs" href={`${PUBLIC_URL}/docs`}>Documentation</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title={this.props.username || 'Loading...'} className="ms-auto">
                            <NavDropdown.Item href="/auth/settings">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/auth/logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        username: state.username,
    }
}

const ReduxPanelNavbar = connect(mapStateToProps)(PanelNavbar);

export default withRouter(ReduxPanelNavbar);