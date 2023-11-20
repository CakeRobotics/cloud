import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { Link } from "react-router-dom";

class Login extends React.Component {
    state = {
        username_or_email: '',
        password: '',
        error_message: '',
    }

    async login() {
        if (this.state.error_message !== '') {
            this.setState({error_message: ''});
            setTimeout(this.login.bind(this), 200);
            return
        }
        try {
            const response = await axios.post(
                '/api/auth/login',
                {
                    username_or_email: this.state.username_or_email,
                    password: this.state.password,
                }
            );
            // Store model tokens
            const token = response.data;
            localStorage.setItem('auth_token', token);
            // Go to cloud panel
            window.location.assign('/');
        } catch (error) {
            var error_message = '';
            if (error.response && error.response.status === 401)
                error_message = 'Wrong username/email or password.';
            else if (error.response)
                error_message = 'Server error.';
            else
                error_message = 'Connection error.';
            this.setState({error_message});
        }
    }

    render() {
        return <main>
            <Alert variant="danger" show={this.state.error_message !== ''}>
                {this.state.error_message}
            </Alert>

            <div className="select-group">
                <p className="select-prompt">Username or email:</p>
                <div className="react-select" dir="ltr">
                    <input
                        id="inputEmail"
                        className="form-control"
                        required
                        autoFocus
                        value={this.state.username_or_email}
                        onChange={(event)=>{this.setState({
                            username_or_email: event.target.value
                        })}}
                    />
                </div>
            </div>

            <div className="select-group">
                <p className="select-prompt">Password:</p>
                <div className="react-select" dir="ltr">
                    <input
                        id="inputPassword"
                        className="form-control"
                        type="password"
                        value={this.state.password}
                        onChange={(event)=>{this.setState({
                            password: event.target.value
                        })}}
                        onKeyUp={((event)=>{
                            event.key === "Enter" && this.login();
                        })}
                    />
                </div>
            </div>

            <div className="button-group">
                <Button onClick={this.login.bind(this)} className="btn-primary" type="submit">Login</Button>
                <Link to="/register"><Button className="btn-secondary">Sign up</Button></Link>
            </div>

            <Link to="/reset" className="bottom-text">Forgot password?</Link>
        </main>
    }
}

export default Login;
