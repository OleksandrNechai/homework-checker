import React from 'react';
import { Table, Grid, Row, Col } from 'react-bootstrap';

const Report = ({ results, date }) =>
    <div>
        <Grid>
            <Row className="show-grid">
                <Col xs={12}>
                    <h1><small>Results on {date}</small></h1>
                    <Table responsive striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Test</th>
                                <th>You scored</th>
                                <th>Max score</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.map(r => (
                                    <tr key={r.name}>
                                        <td>{r.name}</td>
                                        <td>{r.scored}</td>
                                        <td>{r.maxScore}</td>
                                        <td>{r.description.map(d => (
                                            <p key={d}>{d}</p>
                                        ))}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Grid>
    </div>

export default Report;