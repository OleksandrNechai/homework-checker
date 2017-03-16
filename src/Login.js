import React from 'react';
import { Button, Jumbotron} from 'react-bootstrap';

const Login = ({ onClick }) =>

    <div>
        <h1></h1>
        <Jumbotron>
            <h1>Wellcome to APL homework checker!</h1>
            <p>This is a simple web app which allows you to check you APL homework. To use this app you will need a Facebook account. Once you have a Facebook account, please Log In using the button bellow:</p>
            <p><Button bsStyle="primary" bsSize="large" onClick={onClick}><i className="fa fa-facebook-official" aria-hidden="true"></i> Login</Button></p>
        </Jumbotron>
    </div>

export default Login