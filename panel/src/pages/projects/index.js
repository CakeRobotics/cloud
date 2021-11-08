import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ListProjectsPage from './list-projects';
import EditProjectCodePage from './edit-project-code';
import PropsPage from './props';

class ProjectsPage extends Component {
    render() {
        return (
            <Switch>
                <Route path="/projects/:projectId/props">
                    <PropsPage/>
                </Route>
                <Route path="/projects/:projectId">
                    <EditProjectCodePage/>
                </Route>
                <Route path="/projects">
                    <ListProjectsPage/>
                </Route>
            </Switch>
        );
    }
}
 
export default ProjectsPage;