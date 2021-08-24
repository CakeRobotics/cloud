import "./Editor.css";
import "./prism.css";

import React, { Component } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';

class CodeEditor extends Component {    
    render() { 
        return (
            <Editor
                className="code-editor"
                value={this.props.code}
                onValueChange={this.props.onChange}
                highlight={code => highlight(code, languages.python)}
                padding={10}
                tabSize={4}
            />
        );
    }
}
 
export default CodeEditor;