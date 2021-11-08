import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

class TemplatesBreadcrumb extends Component {
    render() {
        const pathName = this.props.location.pathname;
        const key = pathName.split('/')[2];
        return (
            <Breadcrumb>
                <Breadcrumb.Item href={`${process.env.PUBLIC_URL}/templates/all`}>Templates</Breadcrumb.Item>
                {key === 'all' && <Breadcrumb.Item active>All</Breadcrumb.Item>}
                {key === 'library' && <Breadcrumb.Item active>Library</Breadcrumb.Item>}
                {key === 'new' && <Breadcrumb.Item active>New</Breadcrumb.Item>}
                {key === 'edit' && <><Breadcrumb.Item>Edit</Breadcrumb.Item><Breadcrumb.Item active>{pathName.split('/')[3]}</Breadcrumb.Item></>}
            </Breadcrumb>
        );
    }
}
 
export default withRouter(TemplatesBreadcrumb);
