import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Grid, Row, Col } from 'react-bootstrap';
import Report from './Report';
import FileSelector from './FileSelector.js'
import superagent from 'superagent'

class Main extends React.Component {
    constructor() {
        super();
        this.state = { attempId: undefined, files: [] };
    }

    handleClick(attempId) {
        this.setState({ attempId });
    }
    onDrop(files) {
        this.setState({
            files: this.state.files.concat(files)
        });
    }

    handleFileSelected(file) {
        let formData = new FormData();
        formData.append('file', file);
        superagent.post('/api/new-attempt/' + this.props.user.accessToken)
            .send(formData)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                } else if (response.ok) {
                    console.log('OK');
                }
            });
    }

    render() {
        var componentConfig = { postUrl: '/api/new-attempt/' + this.props.user.accessToken };
        var djsConfig = {
            autoProcessQueue: true,
            maxFiles: 1,
            acceptedFiles: '.dws',
            renameFilename: 'test',
            paramName: 'test',
            dictInvalidFileType: 'Only Dyalog Work Space files (.dws) are allowed!',
            dictMaxFilesExceeded: 'You can upload only one file for attempt!'
        }
        var eventHandlers = { addedfile: (file) => console.log(file) }
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
                                    <td><a onClick={() => this.handleClick(1)} href="javascript:"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>21.01.2017 13:00</td>
                                    <td>15%</td>
                                    <td><a onClick={() => this.handleClick(2)} href="javascript:"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>21.01.2017 13:00</td>
                                    <td>5%</td>
                                    <td><a onClick={() => this.handleClick(3)} href="javascript:"><i className="fa fa-table" aria-hidden="true"></i></a></td>
                                </tr>
                            </tbody>
                        </Table>
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