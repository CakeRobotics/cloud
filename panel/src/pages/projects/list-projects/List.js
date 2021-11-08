import React, { Component } from 'react';
import { Table, Card } from 'react-bootstrap';
import { formatRelative } from 'date-fns'

import '../../../common/List.css';

class List extends Component {
    render() {
        const projects = this.props.projects;
        if (projects && projects.length === 0) {
            return (
                <div className="d-flex">
                    <p className="m-auto">Project list is empty.</p>
                </div>
            )
        }
        return (
            <Card body className="list-container">
                <Table>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Last Code Change</th>
                        </tr>
                    </thead>
                    <tbody>{
                        projects.map(project => (
                            <tr key={project._id}>
                                <td><a href={`${process.env.PUBLIC_URL}/projects/${project._id}`}>{project.name}</a></td>
                                <td>{formatRelative(new Date(project.lastChange), new Date())}</td>
                            </tr>
                        ))
                    }</tbody>
                </Table>
            </Card>
        );
    }
}
 
export default List;