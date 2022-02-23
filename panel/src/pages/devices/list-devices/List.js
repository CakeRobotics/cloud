import React, { Component } from 'react';
import { Table, Card } from 'react-bootstrap';
import './DevicesList.css';

import '../../../common/List.css';

class List extends Component {
    render() {
        const devices = this.props.devices;
        if (devices && devices.length === 0) {
            return (
                <div className="d-flex">
                    <p className="m-auto">Device list is empty.</p>
                </div>
            )
        }
        return (
            <Card body className="list-container">
                <Table>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>{
                        devices.map(device => (
                            <tr key={device.name}>
                                <td><a href={`${process.env.PUBLIC_URL}/devices/${device.owner}/${device.name}`}>{device.name}</a></td>
                                <td>{device.online ?
                                    <><div className="inline-circle inline-circle-green"></div> Online </>:
                                    <><div className="inline-circle inline-circle-gray"></div> Offline </>}
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </Table>
            </Card>
        );
    }
}
 
export default List;