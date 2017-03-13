/*global FB*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class About extends React.Component {
  render() {
    return (<h1>About page</h1>);
  }
}
ReactDOM.render(
  <Router>
    <div>
      <Link to="/about">About</Link>
      <Route path='/about' component={About} />
      <Route exact={true} path='/' render={() => <App fb={FB} />} />     
    </div>
  </Router>,
  document.getElementById('root')
);