import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import React from 'react';

class Register extends React.Component {
    state = {
        email: '',
        generatedToken: '',
        error_message: '',
    }

    async createRegistrationToken() {
        if (this.state.error_message !== '') {
            this.setState({error_message: ''});
            setTimeout(this.createRegistrationToken.bind(this), 200);
            return
        }
        try {
            const auth_token = localStorage.getItem('auth_token');
            const response = await axios.post(
                '/api/auth/createRegistrationToken',
                {
                    email: this.state.email,
                },
                {
                    headers: {'Authorization': `Bearer ${auth_token}`},
                }
            );
            const token = response.data;
            this.setState({ generatedToken: token });
        } catch (error) {
            var error_message = '';
            if (error.response && error.response.status === 401)
                error_message = 'Unauthorized attempt.';
            else if (error.response)
                error_message = 'Server error.';
            else
                error_message = 'Connection error.';
            this.setState({error_message});
        }
    }

    render() {
        const auth_token = localStorage.getItem('auth_token');
        if (!auth_token) {
            return <main>
                <p style={{color: 'white'}}>Login first.</p>
            </main>
        }
        return <main>
            <Alert variant="danger" show={this.state.error_message !== ''}>
                {this.state.error_message}
            </Alert>

            <Alert variant="success" show={this.state.generatedToken !== ''}>
                {this.state.generatedToken}
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

            <div className="button-group">
                <Button onClick={this.createRegistrationToken.bind(this)} className="btn-primary" type="submit">Create</Button>
            </div>
        </main>
    }
}

export default Register;
