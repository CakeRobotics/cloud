import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import '@fontsource/actor';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Navbar from './components/Navbar';
import ListProjectsPage from './pages/projects/list-projects/Page';
import EditProjectCodePage from './pages/projects/edit-project-code/Page';

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Navbar currentPage="/projects" />
            <Switch>
                <Route path="/projects/:projectName">
                    <EditProjectCodePage/>
                </Route>
                <Route path="/projects">
                    <ListProjectsPage/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
