import React, { Component } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { connect } from 'react-redux';

import MyToast from './MyToast';

class Toasts extends Component {
    render() {
        if (!this.props.toasts)
            return <></>;

        return (
            <ToastContainer position="top-center" className="p-3">
                {this.props.toasts.map(function (toast) {
                    return (
                        <MyToast key={toast.time} toast={toast}/>
                    );
                })}
            </ToastContainer>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        toasts: state.toasts,
    }
}

const ToastsRedux = connect(mapStateToProps)(Toasts);

export default ToastsRedux;