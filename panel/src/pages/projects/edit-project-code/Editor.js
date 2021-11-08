import "../../../common/Editor.css";
import "../../../common/prism.css";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import classNames from "classnames";

class CodeEditor extends Component {    
    render() {
        const className = classNames(
            'code-editor',
            { 'code-editor-disabled': this.props.pageState !== 'EDITING' }
        );
        return (
            <div className="code-editor-container">
                <Editor
                    className={className}
                    value={this.props.code}
                    onValueChange={this.props.onCodeChange}
                    highlight={code => highlight(code, languages.python)}
                    padding={10}
                    tabSize={4}
                />
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        code: state.projects.current.code,
        pageState: state.projects.current.state,
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        onCodeChange: newCode => {
            dispatch({
                type: 'SET_CODE',
                payload: newCode,
            });
            dispatch({
                type: 'SET_EDITOR_DIRTY',
                payload: true,
            });
        }
    }
}

const ReduxCodeEditor = connect(mapStateToProps, mapDispatchToProps)(CodeEditor);

export default ReduxCodeEditor;