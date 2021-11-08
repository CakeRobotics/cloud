import "../../../common/Editor.css";
import "../../../common/prism.css";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'prismjs/components/prism-python';
import { Form, Spinner } from 'react-bootstrap';
import produce from "immer";

class PropsEditor extends Component {
    render() {
        if (! this.props.props) {
            return <Spinner variant="grow"/>
        }
        return (
            <>
                <Form>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control value={this.props.props.name} onChange={e => {
                        const name = e.target.value;
                        const props = produce(this.props.props, props => {
                            props.name = name;
                        });
                        this.props.onPropsChange(props);
                    }}/>
                </Form>
            </>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        props: state.projects.current.props,
        pageState: state.projects.current.state,
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        onPropsChange: newProps => {
            dispatch({
                type: 'SET_PROPS',
                payload: newProps,
            });
            dispatch({
                type: 'SET_EDITOR_DIRTY',
                payload: true,
            });
        }
    }
}

const ReduxPropsEditor = connect(mapStateToProps, mapDispatchToProps)(PropsEditor);

export default ReduxPropsEditor;