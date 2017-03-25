import React from 'react';
import { Table, Button, Grid, Row, Col } from 'react-bootstrap';
import Report from './Report';
import FileSelector from './FileSelector.js'
import superagent from 'superagent'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attempId: undefined,
            files: [],
            user: props.user
        };
    }

    componentDidMount() {
        this.updateCurrentlyDisplayedUser();
    }

    async updateCurrentlyDisplayedUser() {
        const user = await this.fetchUser();
        this.setState({ user });
    }

    handleClick(e, attempId) {
        e.preventDefault();
        this.setState({ attempId });
    }

    handleFileSelected(file) {
        let formData = new FormData();
        formData.append('file', file);
        superagent.post(`/api/new-attempt/${Date.now()}/${this.props.user.accessToken}`)
            .send(formData)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                } else if (response.ok) {
                    this.updateCurrentlyDisplayedUser();
                }
            });
    }

    fetchUser() {
        return fetch('/api/attempts/' + this.props.user.accessToken).then(function (response) {
            return response.json();
        });
    }

    formatTime(timeStamp) {
        const date = new Date(timeStamp);
        return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    render() {
        return (<div>

            <Grid>
                <Row className="show-grid">
                    <Col xs={10}>{this.props.user
                        ? <h1>Hi, {this.props.user.name}!</h1>
                        : null}</Col>
                    <Col xs={2}> <h1><Button bsStyle="primary" className="pull-right text-center" onClick={this.props.onLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</Button></h1></Col>
                </Row>

                <Row className="show-grid">
                    <Col xs={12}>
                        <FileSelector onSelected={this.handleFileSelected.bind(this)} />

                        {/*
                        <DropzoneComponent config={componentConfig}
                            eventHandlers={eventHandlers}
                            djsConfig={djsConfig} />

                        <FileUploadProgress key='ex1' url='http://localhost:3000/api/upload'
                            onProgress={(e, request, progress) => { console.log('progress', e, request, progress); }}
                            onLoad={(e, request) => { console.log('load', e, request); }}
                            onError={(e, request) => { console.log('error', e, request); }}
                            onAbort={(e, request) => { console.log('abort', e, request); }}
                        />
                        */}

                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12}>
                        {
                            this.state.user && this.state.user.attempts && this.state.user.attempts.length ?
                                <div>
                                    <h1><small>Your attempts to pass tests:</small></h1>
                                    <Table responsive striped bordered condensed hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>When</th>
                                                <th>Passed tests</th>
                                                <th>Detailed report</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <td>1</td>
                                                <td>21.01.2017 13:00</td>
                                                <td>100%</td>
                                                <td><a onClick={e => this.handleClick(e, 1)} href="#"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>21.01.2017 13:00</td>
                                                <td>15%</td>
                                                <td><a onClick={e => this.handleClick(e, 2)} href="#"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>21.01.2017 13:00</td>
                                                <td>5%</td>
                                                <td><a onClick={e => this.handleClick(e, 3)} href="#"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                : <h1><small>You have made no submitions yet</small></h1>
                        }
                    </Col>
                </Row>

            </Grid>

            {
                this.state.attempId ?
                    <Row className="show-grid">
                        <Col xs={12}>
                            <Report attemptId={this.state.attempId} />
                        </Col>
                    </Row> :
                    null
            }

        </div>);
    }
}

export default Main