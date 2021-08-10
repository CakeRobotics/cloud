// TODO: Input validation

import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';
import React from 'react';
import { Link } from "react-router-dom";

class Register extends React.Component {
    state = {
        email: '',
        password: '',
        username: '',
        invitationCode: '',
        error_message: '',
    }

    async register() {
        if (this.state.error_message !== '') {
            this.setState({error_message: ''});
            setTimeout(this.register.bind(this), 200);
            return
        }
        try {
            // REGISTER
            await axios.post(
                '/api/auth/register',
                {
                    email: this.state.email,
                    password: this.state.password,
                    username: this.state.username,
                    registrationToken: this.state.invitationCode,
                }
            );
            // LOGIN
            const loginResponse = await axios.post(
                '/api/auth/login',
                {
                    username_or_email: this.state.email,
                    password: this.state.password,
                }
            );
            //// Store model tokens
            const token = loginResponse.data;
            localStorage.setItem('auth_token', token);
            //// Go to cloud panel
            window.location.assign('/');
        } catch (error) {
            var error_message = '';
            if (error.response && error.response.status === 400)
                error_message = 'Invalid data was entered.';
            else if (error.response && error.response.status === 406)
                error_message = 'Invalid invitation code or mismatched email.';
            else if (error.response && error.response.status === 409)
                error_message = 'Username or email already exists.';
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
                <p className="select-prompt">Email:</p>
                <div className="react-select" dir="ltr">
                    <input
                        id="inputEmail"
                        className="form-control"
                        type="email"
                        required
                        autoFocus
                        value={this.state.email}
                        onChange={(event)=>{this.setState({
                            email: event.target.value
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

            <div className="select-group">
                <p className="select-prompt">Username:</p>
                <div className="react-select" dir="ltr">
                    <input
                        id="inputUsername"
                        className="form-control"
                        required
                        value={this.state.username}
                        onChange={(event)=>{this.setState({
                            username: event.target.value
                        })}}
                    />
                </div>
            </div>

            <div className="select-group">
                <p className="select-prompt">Invitation Code:</p>
                <div className="react-select" dir="ltr">
                    <input
                        id="inputInvitationCode"
                        className="form-control"
                        required
                        value={this.state.invitationCode}
                        onChange={(event)=>{this.setState({
                            invitationCode: event.target.value
                        })}}
                    />
                </div>
            </div>

            <div className="select-group">
                <FormCheck label={<label>I agree to the <a href="https://cakerobotics.com/terms">Terms of Service</a></label>}/>
            </div>

            <div className="button-group">
                <Button onClick={this.register.bind(this)} className="btn-primary" type="submit">Register</Button>
            </div>

            <a href="https://google.com" className="bottom-text">Don't have invitation code?</a>
            <Link to="/login" className="bottom-text">Already have an account?</Link>
        </main>
    }
}

export default Register;
