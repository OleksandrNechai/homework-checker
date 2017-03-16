import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Grid, Row, Col } from 'react-bootstrap';

const Report = ({ onLogOut, attemptId }) => <div>


    <Grid>
        <Row className="show-grid">
            <Col xs={12}>
                <h1>Report {attemptId}</h1>
                <Table responsive striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Test</th>
                            <th>Status</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Test 1</td>
                            <td>Pass</td>
                            <td>Congrats</td>
                        </tr>
                        <tr>
                            <td>Test 2</td>
                            <td>Pass</td>
                            <td>Congrats</td>
                        </tr>
                        <tr>
                            <td>Test 3</td>
                            <td>Fail</td>
                            <td>Expected price to be $12 but got: $13</td>
                        </tr>
                    </tbody>
                </Table>
                <Link to="/main">
                    <Button bsStyle="primary" className="pull-right text-center" onClick={onLogOut}>Back</Button>
                </Link>
            </Col>
        </Row>

    </Grid>
</div>

export default Report;