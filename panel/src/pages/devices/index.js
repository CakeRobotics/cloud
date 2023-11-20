import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ListDevicesPage from './list-devices';
import NewDevice from './new-device';
import DevicePage from './device-page';

class DevicesPage extends Component {
    render() {
        return (
            <Switch>
                <Route path="/devices/new">
                    <NewDevice/>
                </Route>
                <Route path="/devices/:owner/:name">
                    <DevicePage/>
                </Route>
                <Route path="/devices">
                    <ListDevicesPage/>
                </Route>
            </Switch>
        );
    }
}
 
export default DevicesPage;