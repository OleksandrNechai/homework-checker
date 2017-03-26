import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const LoadingProgress = ({ results, date }) =>
    <div>
        <h1><small>Executing tests. This may take a while...</small></h1>
        <ProgressBar active now={100} bsStyle="success"/>
    </div>

export default LoadingProgress;