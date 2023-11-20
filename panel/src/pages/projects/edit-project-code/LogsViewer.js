import axios from 'axios';
import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import './LogsViewer.css';

class LogsViewer extends Component {
    state = {
        logs: "",
        verbose: false,
        follow: true,
    }
    async componentDidMount() {
        await this.getLogs();
    }
    getLogs = async () => {
        if (!this.props.endpoint) {
            return;
        }
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.get(this.props.endpoint, { headers });
            const logs = response.data;
            this.setState({ logs });
        } catch (error) {
            const errorMessage = `Can't access logs:\n${error}`;
            this.setState({ logs: errorMessage });
        }
        if (this.state.follow) {
            const logsViewer = document.getElementById("logs-viewer");
            logsViewer.scrollTop = logsViewer.scrollHeight;
        }
        setTimeout(this.getLogs, 5000);
    }
    logElements = () => {
        if (this.state.verbose) {
            return this.state.logs.map(({ time, group, level, message }, index) => (
                <div key={`${index}-${time}`}><span className="log-group">[{group} {level}]</span> {message}</div>
            ))
        } else {
            return this.state.logs
                .filter(log => log.group === 'robot-logs')
                .filter(log => !log.message.match('__KEEPALIVE__'))
                .map(({ time, message }, index) => (
                    <div key={`${index}-${time}`}><span>{message}</span></div>
                )
            )
        }
    }
    copy = () => {
        const string = this.state.logs
            .filter(log => log.group === 'robot-logs')
            .filter(log => !log.message.match('__KEEPALIVE__'))
            .map(log => log.message).join('');
        navigator.clipboard.writeText(string);
    }
    render() {
        const logs = this.state.logs;
        return (
            <div className="logs-viewer-container d-flex flex-column">
                <div className="logs-viewer-title">
                    <div className="flex-grow-1">Logs: {this.props.endpoint ? this.props.endpoint.match(/(.{4})\/logs/)[1] : "[Select...]"}</div>
                    <button className="link-button text-light me-3" onClick={this.copy}>Copy <Clipboard/></button>
                    <Form.Group className="me-3">
                        <Form.Check>
                            <Form.Check.Input
                                id="verbose"
                                type="checkbox"
                                checked={this.state.verbose}
                                onChange={e => this.setState({ verbose: e.target.checked })}
                                className="me-1"
                            />
                            <Form.Check.Label htmlFor="verbose">Show Details</Form.Check.Label>
                        </Form.Check>
                    </Form.Group>
                    <Form.Group className="me-3">
                        <Form.Check>
                            <Form.Check.Input
                                id="follow"
                                type="checkbox"
                                checked={this.state.follow}
                                onChange={e => this.setState({ follow: e.target.checked })}
                                className="me-1"
                            />
                            <Form.Check.Label htmlFor="follow">Follow</Form.Check.Label>
                        </Form.Check>
                    </Form.Group>
                </div>
                <div className="logs-viewer" id="logs-viewer">
                    {logs.constructor === Array ? this.logElements() : logs}
                </div>
            </div>
        );
    }
}
 
export default LogsViewer;