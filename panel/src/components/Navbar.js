import logo from '../img/logo.svg';
import './Navbar.css';

import React, { Component } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import getUsername from '../functions/getUsername';

const PUBLIC_URL = process.env.PUBLIC_URL || "";

class PanelNavbar extends Component {
    state = {
        username: '',
    }
    async componentDidMount() {
        const username = await getUsername();
        this.setState({ username });
    }
    render() { 
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
                        activeKey={this.props.currentPage}
                        onSelect={(selectedKey) => console.log(`Nav ${selectedKey}`)}
                        >
                        <Nav.Item>
                            <Nav.Link eventKey="/projects" href={`${PUBLIC_URL}/projects`}>Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="/robots" href={`${PUBLIC_URL}/robots`}>Robots</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="/robots" href={`${PUBLIC_URL}/robots`}>Simulations</Nav.Link>
                        </Nav.Item>
                        <div className="navbar-vline"/>
                        <Nav.Item>
                            <Nav.Link eventKey="/docs/tutorials" href={`${PUBLIC_URL}/docs/tutorials`}>Tutorials</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="/docs" href={`${PUBLIC_URL}/docs`}>Documentation</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title={this.state.username} className="ms-auto">
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
 
export default PanelNavbar;