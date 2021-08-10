import './App.css';
import "@fontsource/actor"
import Login from './forms/Login';
import Register from './forms/Register';
import CreateRegistrationToken from './forms/CreateRegistrationToken';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <div className="App">
                <header className="header">
                    <Link to="/">
                        <img className="logo" alt="Logo" src={require('./img/logo-h.png').default} />
                    </Link>
                </header>
                <div className="content">
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/createRegistrationToken">
                            <CreateRegistrationToken/>
                        </Route>
                    </Switch>
                </div>
                <footer className="footer">
                    <p>© 2021 Cake Robotics</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
