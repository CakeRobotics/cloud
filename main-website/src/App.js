import './App.css';
import React from 'react';
import "@fontsource/actor"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Homepage from './pages/homepage';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img className="App-logo" alt="Logo" src={require('./img/logo-h.png').default} />
          </header>
          <Switch>
            <Route path="/">
              <Homepage/>
            </Route>
          </Switch>
          <footer className="App-footer">
            <p>© 2021 Cake Robotics</p>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
