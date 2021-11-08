import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import classNames from 'classnames';

import './MyToast.css';
import { dispatch } from '../redux/store';

class MyToast extends Component {
    close() {
        dispatch({
            type: 'REMOVE_TOAST',
            payload: this.props.toast.time,
        });
    }

    componentDidMount() {
        if (this.props.color === 'SUCCESS') { // FIXME: Not working.
            setTimeout(this.close.bind(this), 2000);
        } else {
            setTimeout(this.close.bind(this), 5000);
        }
    }

    render() {
        const { title, color, subtitle, body } = this.props.toast;

        const className = classNames({
            'toast-success': color === 'SUCCESS',
            'toast-error': color === 'ERROR',
        })

        return (
            <Toast className={className} onClose={this.close.bind(this)}>
                <Toast.Header>
                    <strong className="me-auto">{title}</strong>
                    <small className="text-muted">{subtitle}</small>
                </Toast.Header>
                <Toast.Body hidden={!body}>{body}</Toast.Body>
            </Toast>
        );
    }
}
 
export default MyToast;