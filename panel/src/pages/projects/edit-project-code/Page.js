import './Page.css';
import '../../../common/Sidebar.css';

import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Breadcrumb, Container, Col, Row } from 'react-bootstrap';

import Editor from './Editor';
import SavePanel from './SavePanel';
import SimulationPanel from './SimulationPanel';
import PushToRobotPanel from './PushToRobotPanel';
import loadCode from './functions/loadCode';

class Page extends Component {
    state = {
        code: `import Cake
from time import sleep

class MyRobot:
    def init(self):
        pass

    def loop(self):
        Cake.log("App is working.")
        sleep(1)
`,
    }

    async componentDidMount() {
        const code = await loadCode(this.props.match.params.projectName);
        this.setState({ code });
    }

    render() { 
        return (
            <>
                <Container className="mt-4">
                    <Breadcrumb>
                        <Breadcrumb.Item href={`${process.env.PUBLIC_URL}/projects`}>My Projects</Breadcrumb.Item>
                        <Breadcrumb.Item active>{this.props.match.params.projectName}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <Container>
                    <Row>
                        <Col sm="12" md="4" lg="3">
                            {/* Sidebar */}
                            <SavePanel/>
                            <SimulationPanel/>
                            <PushToRobotPanel/>
                        </Col>
                        <Col sm="12" md="8" lg="6">
                            <Editor code={this.state.code} onChange={code => this.setState({ code })}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
 
export default withRouter(Page);