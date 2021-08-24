import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

const projects = [
    {
        name: "app-2",
        lastCodeChange: 33,
    },
    {
        name: "app-1",
        lastCodeChange: 19,
    },
]

class List extends Component {
    render() { 
        return (
            <Table striped>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Last Code Change</th>
                    </tr>
                </thead>
                <tbody>{
                    projects.map(project => (
                        <tr>
                            <td><a href={`${process.env.PUBLIC_URL}/projects/${project.name}`}>{project.name}</a></td>
                            <td>{project.lastCodeChange}</td>
                        </tr>
                    ))
                }</tbody>
            </Table>
        );
    }
}
 
export default List;