import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import '@fontsource/actor';

import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import init from './functions/init';

import Navbar from './components/Navbar';
import Toasts from './components/Toasts';
import ProjectsPage from './pages/projects';
import DevicesPage from './pages/devices';
import TemplatesPage from './pages/templates';


const initPromise = init();

class App extends Component {
    render() { 
        return (
            <Router basename={process.env.PUBLIC_URL}>
                <Navbar currentPage="/projects" />
                <Toasts/>
                <Switch>
                    <Route path="/projects">
                        <ProjectsPage/>
                    </Route>
                    <Route path="/templates">
                        <TemplatesPage/>
                    </Route>
                    <Route path="/devices">
                        <DevicesPage/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/projects"/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
 
export { App, initPromise };
