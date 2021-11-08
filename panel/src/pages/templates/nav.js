import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class MyNav extends Component {
    render() {
        const pathName = this.props.location.pathname;
        const key = pathName.split('/')[2];
        return (
            <Nav variant="pills" activeKey={key} className="flex-column sidebar-panel">
                <Nav.Link eventKey="all" href={`${process.env.PUBLIC_URL}/templates/all`}>All Templates</Nav.Link>
                <Nav.Link eventKey="new" href={`${process.env.PUBLIC_URL}/templates/new`}>New Template</Nav.Link>
            </Nav>
        );
    }
}
 
export default withRouter(MyNav);